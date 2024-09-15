import React, { useState } from "react";
import styles from "../styles/ApiPreview.module.css";
import ApiTester from "./ApiTester";
import { API, Parameter, Header, BodyItem } from "../types/api";

interface ApiPreviewProps {
  apiInfo: API;
  onClose: () => void;
}

const ApiPreview: React.FC<ApiPreviewProps> = ({ apiInfo, onClose }) => {
  const [showApiTester, setShowApiTester] = useState(false);

  const toggleApiTester = () => {
    setShowApiTester(!showApiTester);
  };

  const renderList = (
    items: any[] | undefined,
    itemRenderer: (item: any) => React.ReactNode
  ) => {
    if (!items || items.length === 0) {
      return <p>情報はありません。</p>;
    }
    return (
      <ul>
        {items.map((item, index) => (
          <li key={index}>{itemRenderer(item)}</li>
        ))}
      </ul>
    );
  };

  const renderParameter = (param: Parameter) => (
    <>
      {param.name} ({param.type}): {param.description}
      {param.required ? " (必須)" : " (任意)"}
      {param.defaultValue !== undefined &&
        ` (デフォルト値: ${param.defaultValue})`}
    </>
  );

  const renderHeader = (header: Header) => (
    <>
      {header.name}: {header.value} (型: {header.type})
    </>
  );

  const renderBodyItem = (item: BodyItem) => (
    <>
      {item.name} ({item.type}): {item.description}
      {item.required !== undefined && (item.required ? " (必須)" : " (任意)")}
      {item.value !== undefined && ` (値: ${item.value})`}
    </>
  );

  const renderFlow = (flow: API["flow"] | undefined) => {
    if (!flow || flow.length === 0) {
      return <p>ワークフロー情報はありません。</p>;
    }
    return (
      <ul>
        {flow.map((flowItem, index) => (
          <li key={index}>
            ノード名: {flowItem.node.nodeName}, タイプ: {flowItem.node.nodeType}
            , エントリーポイント: {flowItem.node.entryPoint ? "はい" : "いいえ"}
            {flowItem.node.nodeParameter &&
              Object.keys(flowItem.node.nodeParameter).length > 0 && (
                <>
                  , パラメータ:
                  <ul>
                    {Object.entries(flowItem.node.nodeParameter).map(
                      ([key, value]) => (
                        <li key={key}>
                          {key}: {value}
                        </li>
                      )
                    )}
                  </ul>
                </>
              )}
          </li>
        ))}
      </ul>
    );
  };

  const renderRequestSection = () => {
    const isFileInput = apiInfo.flow.some(
      (item) => item.node.nodeParameter?.fileInput
    );

    if (isFileInput) {
      return (
        <>
          <h4>リクエスト:</h4>
          <p>このAPIはファイル入力を受け付けます。</p>
          <p>受け付けるファイル形式: PDF, TXT, etc.</p>
        </>
      );
    } else {
      return (
        <>
          <h4>リクエストパラメータ:</h4>
          {renderList(apiInfo.apiRequestParameters, renderParameter)}

          <h4>リクエストヘッダー:</h4>
          {renderList(apiInfo.apiRequestHeaders, renderHeader)}

          <h4>リクエストボディ:</h4>
          {renderList(apiInfo.apiRequestBody, renderBodyItem)}
        </>
      );
    }
  };

  if (!apiInfo) {
    return <div>API情報が利用できません。</div>;
  }

  return (
    <div className={styles.apiPreviewOverlay}>
      <div className={styles.apiPreviewContent}>
        <h2>API プレビュー</h2>
        <div className={styles.apiDetails}>
          <h3>エンドポイント: {apiInfo.apiEndPoint}</h3>
          <h3>説明: {apiInfo.description}</h3>
          <h3>APIタイプ: {apiInfo.apiType}</h3>

          {renderRequestSection()}

          <h4>レスポンスヘッダー:</h4>
          {renderList(apiInfo.apiResponseHeaders, renderHeader)}

          <h4>レスポンスボディ:</h4>
          {renderList(apiInfo.apiResponseBody, renderBodyItem)}

          <h4>ワークフロー:</h4>
          {renderFlow(apiInfo.flow)}
        </div>
        <button onClick={toggleApiTester} className={styles.testButton}>
          {showApiTester ? "APIテスターを閉じる" : "APIをテスト"}
        </button>
        {showApiTester && <ApiTester apiInfo={apiInfo} />}
        <button onClick={onClose} className={styles.closeButton}>
          閉じる
        </button>
      </div>
    </div>
  );
};

export default ApiPreview;
