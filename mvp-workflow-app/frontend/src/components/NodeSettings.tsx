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
    let parsedValue = value;
    if (
      typeof value === "string" &&
      (key === "requestParameters" ||
        key === "requestHeaders" ||
        key === "requestBody" ||
        key === "headers" ||
        key === "body")
    ) {
      try {
        parsedValue = JSON.parse(value);
      } catch (error) {
        console.error(`Invalid JSON format for ${key}:`, error);
        parsedValue = value; // JSONの解析に失敗した場合は、文字列をそのまま使用
      }
    }
    onUpdate({ ...node, params: { ...node.params, [key]: parsedValue } });
  };

  // JSON形式のフィールドの表示を修正
  const getJsonString = (value: any) => {
    if (typeof value === "string") {
      return value;
    }
    return JSON.stringify(value, null, 2);
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

  const handleParamChange = (key: string, value: any) => {
    const updatedParams = { ...node.params, [key]: value };
    onUpdate({ ...node, params: updatedParams });
  };

  const renderFields = () => {
    switch (node.type) {
      case "start":
        return (
          <div>
            <h3 className={styles.title}>スタートノード</h3>
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
                モデル:
                <select
                  value={getJsonString(node.params.model)}
                  onChange={(e) => handleInputChange("model", e.target.value)}
                  className={styles.select}
                >
                  <option value="">モデルを選択</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  <option value="gpt-4">GPT-4</option>
                </select>
              </label>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                プロンプト:
                <textarea
                  value={getJsonString(node.params.prompt)}
                  onChange={(e) => handleInputChange("prompt", e.target.value)}
                  placeholder="LLMのプロンプトを入力してください"
                  className={styles.textarea}
                />
              </label>
            </div>
          </div>
        );
      case "codeExecution":
        return (
          <div>
            <h3 className={styles.title}>コード実行ノード</h3>
            {renderCommonFields()}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Pythonコード:
                <textarea
                  value={getJsonString(node.params.code)}
                  onChange={(e) => handleInputChange("code", e.target.value)}
                  placeholder="実行するPythonコードを入力してください"
                  className={styles.textarea}
                />
              </label>
            </div>
          </div>
        );
      case "httpRequest":
        return (
          <div>
            <h3 className={styles.title}>HTTPリクエストノード</h3>
            {renderCommonFields()}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                URL:
                <input
                  type="text"
                  value={getJsonString(node.params.url)}
                  onChange={(e) => handleInputChange("url", e.target.value)}
                  placeholder="URLを入力してください"
                  className={styles.input}
                />
              </label>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                メソッド:
                <select
                  value={getJsonString(node.params.method)}
                  onChange={(e) => handleInputChange("method", e.target.value)}
                  className={styles.select}
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>
              </label>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                ヘッダー:
                <textarea
                  value={getJsonString(node.params.headers)}
                  onChange={(e) => handleInputChange("headers", e.target.value)}
                  placeholder="ヘッダーをJSON形式で入力してください"
                  className={styles.textarea}
                />
              </label>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                ボディ:
                <textarea
                  value={getJsonString(node.params.body)}
                  onChange={(e) => handleInputChange("body", e.target.value)}
                  placeholder="リクエストボディをJSON形式で入力してください"
                  className={styles.textarea}
                />
              </label>
            </div>
          </div>
        );
      case "template":
        return (
          <div>
            <h3 className={styles.title}>テンプレートノード</h3>
            {renderCommonFields()}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                テンプレート:
                <textarea
                  value={getJsonString(node.params.template)}
                  onChange={(e) =>
                    handleInputChange("template", e.target.value)
                  }
                  placeholder="テンプレートテキストを入力してください"
                  className={styles.textarea}
                />
              </label>
            </div>
          </div>
        );
      case "database":
        return (
          <div>
            <h3 className={styles.title}>データベースノード</h3>
            {renderCommonFields()}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                接続文字列:
                <input
                  type="text"
                  value={getJsonString(node.params.connectionString)}
                  onChange={(e) =>
                    handleInputChange("connectionString", e.target.value)
                  }
                  placeholder="データベース接続文字列を入力してください"
                  className={styles.input}
                />
              </label>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                クエリ:
                <textarea
                  value={getJsonString(node.params.query)}
                  onChange={(e) => handleInputChange("query", e.target.value)}
                  placeholder="SQLクエリを入力してください"
                  className={styles.textarea}
                />
              </label>
            </div>
          </div>
        );
      case "email":
        return (
          <div>
            <h3 className={styles.title}>メールノード</h3>
            {renderCommonFields()}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                宛先:
                <input
                  type="email"
                  value={getJsonString(node.params.to)}
                  onChange={(e) => handleInputChange("to", e.target.value)}
                  placeholder="受信者のメールアドレスを入力してください"
                  className={styles.input}
                />
              </label>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                件名:
                <input
                  type="text"
                  value={getJsonString(node.params.subject)}
                  onChange={(e) => handleInputChange("subject", e.target.value)}
                  placeholder="メールの件名を入力してください"
                  className={styles.input}
                />
              </label>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                本文:
                <textarea
                  value={getJsonString(node.params.body)}
                  onChange={(e) => handleInputChange("body", e.target.value)}
                  placeholder="メールの本文を入力してください"
                  className={styles.textarea}
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
