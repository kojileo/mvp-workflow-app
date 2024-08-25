import React from "react";
import { NodeData } from "../types/workflow";
import styles from "../styles/NodeSettings.module.css";

interface NodeSettingsProps {
  node: NodeData;
  onUpdate: (updatedNode: NodeData) => void;
  onDelete: (nodeIdentifier: string) => void;
}

const NodeSettings: React.FC<NodeSettingsProps> = ({
  node,
  onUpdate,
  onDelete,
}) => {
  const [localNode, setLocalNode] = React.useState(node);

  React.useEffect(() => {
    setLocalNode(node);
  }, [node]);

  const handleDelete = () => {
    if (window.confirm("このノードを削除してもよろしいですか？")) {
      onDelete(localNode.label);
    }
  };

  const renderCommonFields = () => (
    <div className={styles.formGroup}>
      <label className={styles.label}>
        Node Name:
        <input
          type="text"
          value={localNode.label}
          onChange={(e) => onUpdate({ ...localNode, label: e.target.value })}
          className={styles.input}
        />
      </label>
      <button onClick={handleDelete} className={styles.deleteButton}>
        ノードを削除
      </button>
    </div>
  );

  const handleParamChange = (key: string, value: any) => {
    const updatedParams = { ...localNode.params, [key]: value };
    const updatedNode = { ...localNode, params: updatedParams };
    setLocalNode(updatedNode);
    onUpdate(updatedNode);
  };

  const renderFields = () => {
    switch (localNode.type) {
      case "start":
      case "end":
        return (
          <div>
            <h3 className={styles.title}>
              {localNode.type === "start" ? "スタート" : "エンド"}ノード
            </h3>
            {renderCommonFields()}
          </div>
        );
      case "llm":
        return (
          <div>
            <h3 className={styles.title}>LLMノード</h3>
            {renderCommonFields()}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                入力ファイルパラメータ名:
                <input
                  type="text"
                  value={localNode.params.inputFileParam || ""}
                  onChange={(e) =>
                    handleParamChange("inputFileParam", e.target.value)
                  }
                  className={styles.input}
                />
              </label>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                要約の最大長:
                <input
                  type="number"
                  value={localNode.params.maxSummaryLength || ""}
                  onChange={(e) =>
                    handleParamChange("maxSummaryLength", e.target.value)
                  }
                  className={styles.input}
                />
              </label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return <div className="node-settings">{renderFields()}</div>;
};

export default NodeSettings;
