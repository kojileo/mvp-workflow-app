import React, { useState, useCallback } from "react";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  applyEdgeChanges,
  applyNodeChanges,
  NodeChange,
  EdgeChange,
  Connection,
  addEdge,
} from "reactflow";
import "reactflow/dist/style.css";
import { createApi } from "../services/api";
import { NodeType, WorkflowNode, NodeData } from "../types/workflow";
import NodeSettings from "./NodeSettings";
import "reactflow/dist/style.css";
import { Workflow } from "../types/workflow";
import styles from "../styles/WorkflowEditor.module.css";

const nodeTypes: NodeType[] = [
  "start",
  "llm",
  "codeExecution",
  "httpRequest",
  "template",
  "database",
  "email",
  "end", // "end"を追加
];

const WorkflowEditor: React.FC = () => {
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [showApiNameModal, setShowApiNameModal] = useState<boolean>(false);
  const [showApiInfoModal, setShowApiInfoModal] = useState<boolean>(false);
  const [apiEndpoint, setApiEndpoint] = useState<string>("");
  const [apiInfo, setApiInfo] = useState<string>("");
  const [showApiCreatedDialog, setShowApiCreatedDialog] =
    useState<boolean>(false);
  const [apiCreatedInfo, setApiCreatedInfo] = useState<string>("");

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const addNode = (type: NodeType) => {
    const newNode: WorkflowNode = {
      id: (nodes.length + 1).toString(),
      type: "default",
      position: { x: 100, y: 100 },
      data: { label: type, type, params: {} },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const handleNodeClick = (event: React.MouseEvent, node: Node) => {
    setSelectedNode(node as WorkflowNode);
  };

  const handleNodeUpdate = (updatedNodeData: NodeData) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === selectedNode?.id ? { ...node, data: updatedNodeData } : node
      )
    );
  };

  const handleNodeDelete = (nodeIdentifier: string) => {
    setNodes((nds) => nds.filter((node) => node.data.label !== nodeIdentifier));
    setSelectedNode(null);
  };

  const handleCreateApi = async () => {
    try {
      const workflow: Workflow = {
        apiEndPoint: apiEndpoint,
        description: "", // ユーザーが入力できるようにする
        apiType: "POST", // デフォルト値、必要に応じて変更可能
        apiRequestParameters: [],
        apiRequestHeaders: [],
        apiRequestBody: [],
        apiResponseHeaders: [],
        apiResponseBody: [],
        flow: nodes.map((node) => ({
          node: {
            nodeName: node.data.label,
            nodeType: node.data.type,
            nodeParameter: [node.data.params], // 配列に変更
            entryPoint: node.id === "1",
          },
        })),
      };

      // ノードの設定に基づいてワークフローを構築
      nodes.forEach((node) => {
        if (node.data.type === "start") {
          // スタートノードの設定を追加
          workflow.apiRequestParameters =
            node.data.params.requestParameters || [];
          workflow.apiRequestHeaders = node.data.params.requestHeaders || [];
          workflow.apiRequestBody = node.data.params.requestBody || [];
        } else if (node.data.type === "end") {
          // エンドノードの設定を追加
          workflow.apiResponseHeaders = node.data.params.responseHeaders || [];
          workflow.apiResponseBody = node.data.params.responseBody || [];
        }
        // 他のノードタイプに応じた処理を追加
      });

      const response = await createApi(workflow);
      setApiResponse(JSON.stringify(response, null, 2));
      setApiCreatedInfo(
        `APIエンドポイント: ${apiEndpoint}\n\n${response.message || ""}`
      );
      setShowApiCreatedDialog(true);
    } catch (error) {
      console.error("API creation failed:", error);
      setApiResponse("API creation failed. See console for details.");
    }
  };

  const handleCreateApiClick = () => {
    setShowApiNameModal(true);
  };

  const handleApiNameSubmit = async () => {
    if (!apiEndpoint.trim()) {
      alert("APIエンドポイント名を入力してください。");
      return;
    }
    await handleCreateApi();
    setShowApiNameModal(false);
  };

  return (
    <div className={styles.workflowEditor}>
      <div className={styles.sidebar}>
        {nodeTypes.map((type) => (
          <button
            key={type}
            onClick={() => addNode(type)}
            className={styles.addNodeButton}
          >
            Add {type} Node
          </button>
        ))}
      </div>
      <div className={styles.flowContainer}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={handleNodeClick}
        >
          <Controls />
          <Background />
        </ReactFlow>
      </div>
      {selectedNode && (
        <div className={styles.nodeSettingsContainer}>
          <NodeSettings
            node={selectedNode.data}
            onUpdate={handleNodeUpdate}
            onDelete={() => handleNodeDelete(selectedNode.data.label)} // labelを使用
          />
        </div>
      )}
      <button onClick={handleCreateApiClick} className={styles.createApiButton}>
        Create API
      </button>
      {showApiNameModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>APIエンドポイント名を入力</h2>
            <input
              type="text"
              value={apiEndpoint}
              onChange={(e) => setApiEndpoint(e.target.value)}
              placeholder="APIエンドポイント名"
            />
            <button onClick={handleApiNameSubmit}>作成</button>
            <button onClick={() => setShowApiNameModal(false)}>
              キャンセル
            </button>
          </div>
        </div>
      )}

      {showApiCreatedDialog && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>API作成完了</h2>
            <pre>{apiCreatedInfo}</pre>
            <button onClick={() => setShowApiCreatedDialog(false)}>
              閉じる
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default WorkflowEditor;
