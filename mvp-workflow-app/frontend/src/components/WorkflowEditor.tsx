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
import { API, Workflow } from "../types/api";
import NodeSettings from "./NodeSettings";
import styles from "../styles/WorkflowEditor.module.css";
import { FaPlus, FaInfoCircle, FaCode } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import ApiPreview from "./ApiPreview";

const nodeTypes: NodeType[] = ["start", "llm", "end"];

const WorkflowEditor: React.FC = () => {
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [showApiInfoModal, setShowApiInfoModal] = useState<boolean>(false);
  const [showApiPreview, setShowApiPreview] = useState<boolean>(false);
  const [apiInfo, setApiInfo] = useState({
    apiEndpoint: "",
    description: "",
    apiType: "POST",
    requestParameters: [],
    requestHeaders: [],
    requestBody: [],
  });
  const [isValidWorkflow, setIsValidWorkflow] = useState<boolean>(false);
  const [apiCreated, setApiCreated] = useState(false);
  const [createdApiInfo, setCreatedApiInfo] = useState<API | null>(null);

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
      const workflowData: Workflow = {
        apiEndPoint: apiInfo.apiEndpoint,
        description: apiInfo.description,
        apiType: apiInfo.apiType,
        apiRequestParameters: [
          {
            name: "text",
            type: "string",
            description: "要約するテキスト",
            required: true,
          },
          {
            name: "max_length",
            type: "number",
            description: "要約の最大長",
            required: false,
            defaultValue: 100,
          },
          {
            name: "language",
            type: "string",
            description: "要約の言語",
            required: false,
            defaultValue: "日本語",
          },
        ],
        apiRequestHeaders: [
          {
            name: "Content-Type",
            value: "application/json",
            type: "string",
          },
          {
            name: "Authorization",
            value: "Bearer YOUR_API_KEY",
            type: "string",
          },
        ],
        apiRequestBody: [
          {
            name: "file",
            type: "file",
            description: "アップロードするファイル",
            required: true,
            value: "", // 空文字列を初期値として設定
          },
        ],
        apiResponseHeaders: [],
        apiResponseBody: [
          {
            name: "summary",
            type: "string",
            description: "生成された要約テキスト",
            value: "", // 空文字列を初期値として設定
          },
          {
            name: "original_length",
            type: "number",
            description: "元のテキストの長さ",
            value: 0, // 初期値を0に設定
          },
          {
            name: "summary_length",
            type: "number",
            description: "要約テキストの長さ",
            value: 0, // 初期値を0に設定
          },
        ],
        flow: nodes.map((node) => ({
          node: {
            nodeName: node.data.label,
            nodeType: node.data.type,
            nodeParameter: {
              ...node.data.params,
              fileInput: node.data.params.fileInput || false,
            },
            entryPoint: node.data.type === "start",
          },
        })),
      };

      // ファイル入力が有効な場合、リクエストボディを調整
      if (
        workflowData.flow.some((item) => item.node.nodeParameter?.fileInput)
      ) {
        workflowData.apiRequestBody = [
          {
            name: "file",
            type: "file",
            description: "アップロードするファイル",
            required: true,
            value: "", // 空文字列を初期値として設定
          },
        ];
      }

      const response = await createApi({ workflow: workflowData });
      setApiCreated(true);
      setCreatedApiInfo(workflowData);
      setShowApiPreview(true);
      saveCreatedApi(workflowData);
    } catch (error) {
      console.error("API creation failed:", error);
      toast.error("APIの作成に失敗しました。");
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
        <h2 className={styles.sidebarTitle}>ワークフローエディタ</h2>
        <button onClick={handleApiInfoClick} className={styles.apiInfoButton}>
          <FaInfoCircle className={styles.buttonIcon} />
          API基本情報設定
        </button>
        <div className={styles.nodeButtonsContainer}>
          {nodeTypes.map((type) => (
            <button
              key={type}
              onClick={() => addNode(type)}
              className={styles.addNodeButton}
            >
              <FaPlus className={styles.buttonIcon} />
              {type.charAt(0).toUpperCase() + type.slice(1)}ノード追加
            </button>
          ))}
        </div>
        <button
          onClick={handleCreateApi}
          disabled={!isValidWorkflow}
          className={styles.createApiButton}
        >
          <FaCode className={styles.buttonIcon} />
          API作成
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
            onDelete={handleNodeDelete}
          />
        </div>
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
      {showApiPreview && createdApiInfo && (
        <ApiPreview
          apiInfo={createdApiInfo}
          onClose={() => setShowApiPreview(false)}
        />
      )}
    </div>
  );
};
export default WorkflowEditor;
