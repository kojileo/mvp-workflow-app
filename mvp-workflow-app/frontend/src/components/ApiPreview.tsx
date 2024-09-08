import React, { useState } from "react";
import styles from "../styles/ApiPreview.module.css";
import ApiTester from "./ApiTester";

interface ApiPreviewProps {
  apiInfo: string;
  onClose: () => void;
}

const ApiPreview: React.FC<ApiPreviewProps> = ({ apiInfo, onClose }) => {
  const apiData = JSON.parse(apiInfo);
  const [showApiTester, setShowApiTester] = useState(false);

  const toggleApiTester = () => {
    setShowApiTester(!showApiTester);
  };

  return (
    <div className={styles.apiPreviewOverlay}>
      <div className={styles.apiPreviewContent}>
        <h2>API プレビュー</h2>
        <div className={styles.apiDetails}>
          <h3>エンドポイント: {apiData.apiEndPoint}</h3>
          <h3>説明: {apiData.description}</h3>
          <h3>APIタイプ: {apiData.apiType}</h3>

          <h4>リクエストパラメータ:</h4>
          <ul>
            {apiData.apiRequestParameters.map((param: any, index: number) => (
              <li key={index}>
                {param.name} ({param.type}): {param.description}
                {param.required ? " (必須)" : ""}
              </li>
            ))}
          </ul>

          <h4>レスポンスボディ:</h4>
          <ul>
            {apiData.apiResponseBody.map((item: any, index: number) => (
              <li key={index}>
                {item.name}: {item.value}
              </li>
            ))}
          </ul>
        </div>
        <button onClick={toggleApiTester} className={styles.testButton}>
          {showApiTester ? "APIテスターを閉じる" : "APIをテスト"}
        </button>
        {showApiTester && <ApiTester apiEndpoint={apiData.apiEndPoint} />}
        <button onClick={onClose} className={styles.closeButton}>
          閉じる
        </button>
      </div>
    </div>
  );
};

export default ApiPreview;
