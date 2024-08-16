import React from "react";
import { NodeData } from "../types/workflow";
import styles from "../styles/NodeSettings.module.css";

interface NodeSettingsProps {
  node: NodeData;
  onUpdate: (updatedNode: NodeData) => void;
  onDelete: (nodeIdentifier: string) => void; // idの代わりに一般的な名前を使用
}

const NodeSettings: React.FC<NodeSettingsProps> = ({
  node,
  onUpdate,
  onDelete,
}) => {
  const handleInputChange = (key: string, value: any) => {
    onUpdate({ ...node, params: { ...node.params, [key]: value } });
  };

  const handleDelete = () => {
    if (window.confirm("このノードを削除してもよろしいですか？")) {
      onDelete(node.label);
    }
  };

  const renderCommonFields = () => (
    <div className={styles.formGroup}>
      <label className={styles.label}>
        Node Name:
        <input
          type="text"
          value={node.label}
          onChange={(e) => onUpdate({ ...node, label: e.target.value })}
          className={styles.input}
        />
      </label>
      <button onClick={handleDelete} className={styles.deleteButton}>
        ノードを削除
      </button>
    </div>
  );

  const renderFields = () => {
    switch (node.type) {
      case "start":
        return (
          <div>
            <h3 className={styles.title}>Start Node</h3>
            {renderCommonFields()}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Input Prompt:
                <input
                  type="text"
                  value={node.params.inputPrompt || ""}
                  onChange={(e) =>
                    handleInputChange("inputPrompt", e.target.value)
                  }
                  placeholder="Enter input prompt"
                  className={styles.input}
                />
              </label>
            </div>
          </div>
        );
      case "llm":
        return (
          <div>
            <h3 className={styles.title}>LLM Node</h3>
            {renderCommonFields()}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Model:
                <select
                  value={node.params.model || ""}
                  onChange={(e) => handleInputChange("model", e.target.value)}
                  className={styles.select}
                >
                  <option value="">Select Model</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  <option value="gpt-4">GPT-4</option>
                </select>
              </label>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Prompt:
                <textarea
                  value={node.params.prompt || ""}
                  onChange={(e) => handleInputChange("prompt", e.target.value)}
                  placeholder="Enter prompt for LLM"
                  className={styles.textarea}
                />
              </label>
            </div>
          </div>
        );
      case "codeExecution":
        return (
          <div>
            <h3>Code Execution Node</h3>
            {renderCommonFields()}
            <label>
              Python Code:
              <textarea
                value={node.params.code || ""}
                onChange={(e) => handleInputChange("code", e.target.value)}
                placeholder="Enter Python code to execute"
              />
            </label>
          </div>
        );
      case "httpRequest":
        return (
          <div>
            <h3>HTTP Request Node</h3>
            {renderCommonFields()}
            <label>
              URL:
              <input
                type="text"
                value={node.params.url || ""}
                onChange={(e) => handleInputChange("url", e.target.value)}
                placeholder="Enter URL"
              />
            </label>
            <label>
              Method:
              <select
                value={node.params.method || "GET"}
                onChange={(e) => handleInputChange("method", e.target.value)}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </label>
            <label>
              Headers:
              <textarea
                value={node.params.headers || ""}
                onChange={(e) => handleInputChange("headers", e.target.value)}
                placeholder="Enter headers in JSON format"
              />
            </label>
            <label>
              Body:
              <textarea
                value={node.params.body || ""}
                onChange={(e) => handleInputChange("body", e.target.value)}
                placeholder="Enter request body"
              />
            </label>
          </div>
        );
      case "template":
        return (
          <div>
            <h3>Template Node</h3>
            {renderCommonFields()}
            <label>
              Template:
              <textarea
                value={node.params.template || ""}
                onChange={(e) => handleInputChange("template", e.target.value)}
                placeholder="Enter template text"
              />
            </label>
          </div>
        );
      case "database":
        return (
          <div>
            <h3>Database Node</h3>
            {renderCommonFields()}
            <label>
              Connection String:
              <input
                type="text"
                value={node.params.connectionString || ""}
                onChange={(e) =>
                  handleInputChange("connectionString", e.target.value)
                }
                placeholder="Enter database connection string"
              />
            </label>
            <label>
              Query:
              <textarea
                value={node.params.query || ""}
                onChange={(e) => handleInputChange("query", e.target.value)}
                placeholder="Enter SQL query"
              />
            </label>
          </div>
        );
      case "email":
        return (
          <div>
            <h3>Email Node</h3>
            {renderCommonFields()}
            <label>
              To:
              <input
                type="email"
                value={node.params.to || ""}
                onChange={(e) => handleInputChange("to", e.target.value)}
                placeholder="Enter recipient email"
              />
            </label>
            <label>
              Subject:
              <input
                type="text"
                value={node.params.subject || ""}
                onChange={(e) => handleInputChange("subject", e.target.value)}
                placeholder="Enter email subject"
              />
            </label>
            <label>
              Body:
              <textarea
                value={node.params.body || ""}
                onChange={(e) => handleInputChange("body", e.target.value)}
                placeholder="Enter email body"
              />
            </label>
          </div>
        );
      default:
        return null;
    }
  };

  return <div className="node-settings">{renderFields()}</div>;
};

export default NodeSettings;
