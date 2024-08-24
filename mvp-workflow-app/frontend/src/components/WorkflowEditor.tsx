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
import { Workflow } from "../types/workflow";
import styles from "../styles/WorkflowEditor.module.css";
import { FaTimes } from "react-icons/fa";

const nodeTypes: NodeType[] = [
  "start",
  "llm",
  "codeExecution",
  "httpRequest",
  "template",
  "database",
  "email",
  "end",
];

const WorkflowEditor: React.FC = () => {
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [showApiNameModal, setShowApiNameModal] = useState<boolean>(false);
  const [showApiInfoModal, setShowApiInfoModal] = useState<boolean>(false);
  const [apiInfo, setApiInfo] = useState({
    apiEndpoint: "",
    description: "",
    apiType: "POST",
    requestParameters: [],
    requestHeaders: [],
    requestBody: [],
  });
  const [showApiCreatedDialog, setShowApiCreatedDialog] =
    useState<boolean>(false);
  const [apiCreatedInfo, setApiCreatedInfo] = useState<string>("");
  const [apiEndpoint, setApiEndpoint] = useState<string>("");

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
        apiEndPoint: apiInfo.apiEndpoint,
        description: apiInfo.description,
        apiType: apiInfo.apiType,
        apiRequestParameters: apiInfo.requestParameters,
        apiRequestHeaders: apiInfo.requestHeaders,
        apiRequestBody: apiInfo.requestBody,
        apiResponseHeaders: [],
        apiResponseBody: [],
        flow: nodes.map((node) => ({
          node: {
            nodeName: node.data.label,
            nodeType: node.data.type,
            nodeParameter: [node.data.params],
            entryPoint: node.id === "1",
          },
        })),
      };

      nodes.forEach((node) => {
        if (node.data.type === "end") {
          workflow.apiResponseHeaders = node.data.params.responseHeaders || [];
          workflow.apiResponseBody = node.data.params.responseBody || [];
        }
      });

      const response = await createApi(workflow);
      setApiResponse(JSON.stringify(response, null, 2));
      setApiCreatedInfo(
        `APIエンドポイント: ${apiInfo.apiEndpoint}\n\n${response.message || ""}`
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
    setApiInfo((prev) => ({ ...prev, apiEndpoint: apiEndpoint }));
    await handleCreateApi();
    setShowApiNameModal(false);
  };

  const handleApiInfoClick = () => {
    setShowApiInfoModal(true);
  };

  const handleApiInfoSubmit = () => {
    setShowApiInfoModal(false);
  };

  const handleApiInfoChange = (key: string, value: any) => {
    setApiInfo((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className={styles.workflowEditor}>
      <div className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>ワークフロー編集</h2>
        <button onClick={handleApiInfoClick} className={styles.apiInfoButton}>
          <i className="fas fa-info-circle"></i> API基本情報を設定
        </button>
        <div className={styles.nodeButtonsContainer}>
          {nodeTypes.map((type) => (
            <button
              key={type}
              onClick={() => addNode(type)}
              className={styles.addNodeButton}
            >
              <i className={`fas fa-plus-circle ${styles.buttonIcon}`}></i>{" "}
              {type}ノード追加
            </button>
          ))}
        </div>
        <button
          onClick={handleCreateApiClick}
          className={styles.createApiButton}
        >
          <i className="fas fa-code"></i> API作成
        </button>
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
            onDelete={() => handleNodeDelete(selectedNode.data.label)}
          />
        </div>
      )}
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
      {showApiInfoModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>
              API基本情報
              <button
                onClick={() => setShowApiInfoModal(false)}
                className={styles.closeButton}
              >
                <FaTimes />
              </button>
            </h2>
            <div className={styles.formGroup}>
              <label htmlFor="apiEndpoint">APIエンドポイント名</label>
              <input
                id="apiEndpoint"
                type="text"
                value={apiInfo.apiEndpoint}
                onChange={(e) =>
                  handleApiInfoChange("apiEndpoint", e.target.value)
                }
                placeholder="例: /api/v1/users"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="description">APIの説明</label>
              <textarea
                id="description"
                value={apiInfo.description}
                onChange={(e) =>
                  handleApiInfoChange("description", e.target.value)
                }
                placeholder="APIの機能や用途について説明してください"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="apiType">HTTPメソッド</label>
              <select
                id="apiType"
                value={apiInfo.apiType}
                onChange={(e) => handleApiInfoChange("apiType", e.target.value)}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="requestParameters">リクエストパラメータ</label>
              <textarea
                id="requestParameters"
                value={JSON.stringify(apiInfo.requestParameters, null, 2)}
                onChange={(e) =>
                  handleApiInfoChange(
                    "requestParameters",
                    JSON.parse(e.target.value)
                  )
                }
                placeholder='[{"name": "userId", "type": "string"}]'
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="requestHeaders">リクエストヘッダー</label>
              <textarea
                id="requestHeaders"
                value={JSON.stringify(apiInfo.requestHeaders, null, 2)}
                onChange={(e) =>
                  handleApiInfoChange(
                    "requestHeaders",
                    JSON.parse(e.target.value)
                  )
                }
                placeholder='[{"name": "Authorization", "value": "Bearer token"}]'
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="requestBody">リクエストボディ</label>
              <textarea
                id="requestBody"
                value={JSON.stringify(apiInfo.requestBody, null, 2)}
                onChange={(e) =>
                  handleApiInfoChange("requestBody", JSON.parse(e.target.value))
                }
                placeholder='{ "key": "value" }'
              />
            </div>
            <div className={styles.modalActions}>
              <button
                onClick={handleApiInfoSubmit}
                className={styles.saveButton}
              >
                保存
              </button>
              <button
                onClick={() => setShowApiInfoModal(false)}
                className={styles.cancelButton}
              >
                キャンセル
              </button>
            </div>
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
