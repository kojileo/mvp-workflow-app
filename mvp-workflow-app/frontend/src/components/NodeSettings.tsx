import React, { useState, useEffect } from "react";
import { NodeData } from "../types/workflow";
import styles from "../styles/NodeSettings.module.css";
import { FaTrash, FaCog } from "react-icons/fa";

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
  const [localNode, setLocalNode] = useState(node);

  useEffect(() => {
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
        ノード名:
        <input
          type="text"
          value={localNode.label}
          onChange={(e) => {
            const updatedNode = { ...localNode, label: e.target.value };
            setLocalNode(updatedNode);
            onUpdate(updatedNode);
          }}
          className={styles.input}
        />
      </label>
      <button onClick={handleDelete} className={styles.deleteButton}>
        <FaTrash className={styles.buttonIcon} />
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
          <div className={styles.nodeSettings}>
            <h3 className={styles.title}>
              <FaCog className={styles.titleIcon} />
              {localNode.type === "start" ? "スタート" : "エンド"}ノード設定
            </h3>
            {renderCommonFields()}
          </div>
        );
      case "llm":
        return (
          <div className={styles.nodeSettings}>
            <h3 className={styles.title}>
              <FaCog className={styles.titleIcon} />
              LLMノード設定
            </h3>
            {renderCommonFields()}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                AI機能:
                <select
                  value={localNode.params.aiFunction || ""}
                  onChange={(e) =>
                    handleParamChange("aiFunction", e.target.value)
                  }
                  className={styles.input}
                >
                  <option value="">選択してください</option>
                  <option value="summarize">要約</option>
                  <option value="translate">翻訳</option>
                  <option value="analyze">分析</option>
                  <option value="generate">生成</option>
                  <option value="custom">カスタム</option>
                </select>
              </label>
            </div>
            {localNode.params.aiFunction === "summarize" && (
              <>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    最大文字数:
                    <input
                      type="number"
                      value={localNode.params.maxLength || ""}
                      onChange={(e) =>
                        handleParamChange("maxLength", e.target.value)
                      }
                      className={styles.input}
                      placeholder="例: 500"
                    />
                  </label>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    言語:
                    <input
                      type="text"
                      value={localNode.params.language || ""}
                      onChange={(e) =>
                        handleParamChange("language", e.target.value)
                      }
                      className={styles.input}
                      placeholder="例: auto"
                    />
                  </label>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    ファイル入力:
                    <input
                      type="checkbox"
                      checked={localNode.params.fileInput || false}
                      onChange={(e) =>
                        handleParamChange("fileInput", e.target.checked)
                      }
                      className={styles.checkbox}
                    />
                  </label>
                </div>
              </>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return renderFields();
};

export default NodeSettings;
