import React, { useState } from "react";
import styles from "../styles/ApiPreview.module.css";
import ApiTester from "./ApiTester";
import { API } from "../types/api";

interface ApiPreviewProps {
  apiInfo: API;
  onClose: () => void;
}

const ApiPreview: React.FC<ApiPreviewProps> = ({ apiInfo, onClose }) => {
  const [showApiTester, setShowApiTester] = useState(false);

  const toggleApiTester = () => {
    setShowApiTester(!showApiTester);
  };

  return (
    <div className={styles.apiPreviewOverlay}>
      <div className={styles.apiPreviewContent}>
        <h2>API プレビュー</h2>
        <div className={styles.apiDetails}>
          <h3>エンドポイント: {apiInfo.apiEndPoint}</h3>
          <h3>説明: {apiInfo.description}</h3>
          <h3>APIタイプ: {apiInfo.apiType}</h3>

          <h4>リクエストパラメータ:</h4>
          <ul>
            {apiInfo.apiRequestParameters &&
            apiInfo.apiRequestParameters.length > 0 ? (
              apiInfo.apiRequestParameters.map((param, index) => (
                <li key={index}>
                  {param.name} ({param.type}): {param.description}
                  {param.required ? " (必須)" : " (任意)"}
                  {param.default !== undefined
                    ? ` デフォルト値: ${param.default}`
                    : ""}
                </li>
              ))
            ) : (
              <li>リクエストパラメータはありません</li>
            )}
          </ul>

          <h4>レスポンスボディ:</h4>
          <ul>
            {apiInfo.apiResponseBody && apiInfo.apiResponseBody.length > 0 ? (
              apiInfo.apiResponseBody.map((item, index) => (
                <li key={index}>
                  {item.name}: {item.value}
                </li>
              ))
            ) : (
              <li>レスポンスボディの情報はありません</li>
            )}
          </ul>
        </div>
        <button onClick={toggleApiTester} className={styles.testButton}>
          {showApiTester ? "APIテスターを閉じる" : "APIをテスト"}
        </button>
        {showApiTester && (
          <ApiTester
            apiEndpoint={apiInfo.apiEndPoint}
            apiType={apiInfo.apiType}
          />
        )}
        <button onClick={onClose} className={styles.closeButton}>
          閉じる
        </button>
      </div>
    </div>
  );
};

export default ApiPreview;
