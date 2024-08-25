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
                  onChange={(e) => {
                    const newFunction = e.target.value;
                    let newParams: {
                      aiFunction: string;
                      inputType: string;
                      inputParam: string;
                      outputParam: string;
                      targetLanguage?: string;
                      customPrompt?: string;
                    } = {
                      aiFunction: newFunction,
                      inputType: "text",
                      inputParam: "",
                      outputParam: "",
                    };

                    switch (newFunction) {
                      case "summarize":
                        newParams = {
                          ...newParams,
                          inputParam: "text_to_summarize",
                          outputParam: "summary",
                        };
                        break;
                      case "translate":
                        newParams = {
                          ...newParams,
                          inputParam: "text_to_translate",
                          outputParam: "translated_text",
                          targetLanguage: "en",
                        };
                        break;
                      case "analyze":
                        newParams = {
                          ...newParams,
                          inputParam: "text_to_analyze",
                          outputParam: "analysis_result",
                        };
                        break;
                      case "generate":
                        newParams = {
                          ...newParams,
                          inputParam: "generation_prompt",
                          outputParam: "generated_text",
                        };
                        break;
                      case "custom":
                        newParams = {
                          ...newParams,
                          inputParam: "custom_input",
                          outputParam: "custom_output",
                          customPrompt: "",
                        };
                        break;
                    }
                    const updatedNode = {
                      ...localNode,
                      params: { ...localNode.params, ...newParams },
                    };
                    setLocalNode(updatedNode);
                    onUpdate(updatedNode);
                  }}
                  className={styles.input}
                >
                  <option value="">選択してください</option>
                  <option value="summarize">要約</option>
                  <option value="translate">翻訳</option>
                  <option value="analyze">分析</option>
                  <option value="generate">文章生成</option>
                  <option value="custom">カスタム</option>
                </select>
              </label>
            </div>
            {localNode.params.aiFunction && (
              <>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    入力形式:
                    <select
                      value={localNode.params.inputType || "text"}
                      onChange={(e) =>
                        handleParamChange("inputType", e.target.value)
                      }
                      className={styles.input}
                    >
                      <option value="text">テキスト</option>
                      <option value="file">ファイル</option>
                      <option value="url">URL</option>
                    </select>
                  </label>
                </div>
                {localNode.params.aiFunction === "translate" && (
                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      翻訳先言語:
                      <select
                        value={localNode.params.targetLanguage || "en"}
                        onChange={(e) =>
                          handleParamChange("targetLanguage", e.target.value)
                        }
                        className={styles.input}
                      >
                        <option value="en">英語</option>
                        <option value="ja">日本語</option>
                        <option value="zh">中国語</option>
                        <option value="es">スペイン語</option>
                        <option value="fr">フランス語</option>
                      </select>
                    </label>
                  </div>
                )}
                {localNode.params.aiFunction === "custom" && (
                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      カスタムプロンプト:
                      <textarea
                        value={localNode.params.customPrompt || ""}
                        onChange={(e) =>
                          handleParamChange("customPrompt", e.target.value)
                        }
                        className={`${styles.input} ${styles.textarea}`}
                        rows={4}
                        placeholder="AIに実行してほしいタスクを記述します"
                      />
                    </label>
                  </div>
                )}
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    入力パラメータ名:
                    <input
                      type="text"
                      value={localNode.params.inputParam || ""}
                      onChange={(e) =>
                        handleParamChange("inputParam", e.target.value)
                      }
                      className={styles.input}
                      readOnly={localNode.params.aiFunction !== "custom"}
                    />
                  </label>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    出力パラメータ名:
                    <input
                      type="text"
                      value={localNode.params.outputParam || ""}
                      onChange={(e) =>
                        handleParamChange("outputParam", e.target.value)
                      }
                      className={styles.input}
                      readOnly={localNode.params.aiFunction !== "custom"}
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
