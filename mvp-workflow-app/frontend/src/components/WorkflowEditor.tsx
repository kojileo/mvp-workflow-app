import React, { useState, useCallback, useRef, useEffect } from "react";
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
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

const nodeTypes: NodeType[] = ["start", "llm", "end"];

const WorkflowEditor: React.FC = () => {
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [showApiInfoModal, setShowApiInfoModal] = useState<boolean>(false);
  const [apiInfo, setApiInfo] = useState({
    apiEndpoint: "",
    description: "",
    apiType: "POST",
    requestParameters: [],
    requestHeaders: [],
    requestBody: [],
  });
  const [isValidWorkflow, setIsValidWorkflow] = useState<boolean>(false);
  const [apiCreated, setApiCreated] = useState<boolean>(false);
  const [createdApiInfo, setCreatedApiInfo] = useState<string>("");

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
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const addNode = (type: NodeType) => {
    const newNode: WorkflowNode = {
      id: uuidv4(),
      type: "default",
      position: { x: 100, y: 100 },
      data: { label: type, type, params: {} },
    };
    setNodes((nds) => [...nds, newNode]);
    validateWorkflow([...nodes, newNode], edges);
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

  const handleApiInfoClick = () => {
    setShowApiInfoModal(true);
  };

  const handleApiInfoSubmit = () => {
    setShowApiInfoModal(false);
    validateWorkflow(nodes, edges);
  };

  const handleApiInfoChange = (key: string, value: any) => {
    setApiInfo((prev) => ({ ...prev, [key]: value }));
  };

  const validateWorkflow = (
    currentNodes: WorkflowNode[],
    currentEdges: Edge[]
  ) => {
    const hasStart = currentNodes.some((node) => node.data.type === "start");
    const hasEnd = currentNodes.some((node) => node.data.type === "end");
    const hasLLM = currentNodes.some((node) => node.data.type === "llm");
    const isConnected = currentEdges.length >= 2;
    const hasApiInfo = apiInfo.apiEndpoint && apiInfo.description;

    setIsValidWorkflow(
      !!(hasStart && hasEnd && hasLLM && isConnected && hasApiInfo)
    );
  };

  const handleCreateApi = async () => {
    if (!isValidWorkflow) {
      toast.error("有効なワークフローを作成してください。");
      return;
    }

    try {
      const workflowData = {
        apiEndPoint: apiInfo.apiEndpoint,
        description: apiInfo.description,
        apiType: apiInfo.apiType,
        apiRequestParameters: [],
        apiRequestHeaders: [],
        apiRequestBody: [],
        apiResponseHeaders: [],
        apiResponseBody: [],
        flow: nodes.map((node) => ({
          node: {
            nodeName: node.data.label,
            nodeType: node.data.type,
            nodeParameter: node.data.params,
            entryPoint: node.id === "1",
          },
        })),
      };

      const response = await createApi({ workflow: workflowData });
      toast.success("APIが正常に作成されました。");
      saveCreatedApi(response);
      setApiCreated(true);
      setCreatedApiInfo(
        `APIエンドポイント: ${response.apiEndPoint}\n説明: ${apiInfo.description}`
      );
    } catch (error) {
      console.error("API creation failed:", error);
      toast.error("API作成に失敗しました。");
    }
  };

  const saveCreatedApi = (apiData: any) => {
    const savedApis = JSON.parse(localStorage.getItem("createdApis") || "[]");
    savedApis.push(apiData);
    localStorage.setItem("createdApis", JSON.stringify(savedApis));
  };

  return (
    <div className={styles.workflowEditor}>
      <div className={styles.sidebar}>
        <button onClick={handleApiInfoClick}>API基本情報設定</button>
        <button onClick={() => addNode("start")}>Startノード追加</button>
        <button onClick={() => addNode("llm")}>LLMノード追加</button>
        <button onClick={() => addNode("end")}>Endノード追加</button>
        <button
          onClick={handleCreateApi}
          disabled={!isValidWorkflow}
          className={styles.createApiButton}
        >
          API作成
        </button>
      </div>
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
      {selectedNode && (
        <NodeSettings
          node={selectedNode.data}
          onUpdate={handleNodeUpdate}
          onDelete={handleNodeDelete}
        />
      )}
      {showApiInfoModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>API基本情報設定</h2>
            <div className={styles.formGroup}>
              <label htmlFor="apiEndpoint">APIエンドポイント</label>
              <input
                id="apiEndpoint"
                type="text"
                value={apiInfo.apiEndpoint}
                onChange={(e) =>
                  handleApiInfoChange("apiEndpoint", e.target.value)
                }
                placeholder="例: /api/v1/summarize"
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
      {apiCreated && (
        <div className={styles.apiCreatedModal}>
          <div className={styles.modalContent}>
            <h2>API作成完了</h2>
            <pre>{createdApiInfo}</pre>
            <button onClick={() => setApiCreated(false)}>閉じる</button>
          </div>
        </div>
      )}
    </div>
  );
};
export default WorkflowEditor;
