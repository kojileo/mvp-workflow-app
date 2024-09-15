import React, { useState } from "react";
import axios from "axios";
import styles from "../styles/ApiTester.module.css";
import { API } from "../types/api";

interface ApiTesterProps {
  apiInfo: API;
}

const ApiTester: React.FC<ApiTesterProps> = ({ apiInfo }) => {
  const [requestBody, setRequestBody] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    setLoading(true);
    try {
      const headers = apiInfo.apiRequestHeaders.reduce((acc, header) => {
        acc[header.name] = header.value;
        return acc;
      }, {} as Record<string, string>);

      const apiEndpoint = `/api/v1/${apiInfo.apiEndPoint.replace(/^\//, "")}`;
      const response = await axios({
        method: apiInfo.apiType,
        url: `http://localhost:8000${apiEndpoint}`,
        headers: headers,
        data: JSON.parse(requestBody),
      });

      setResponse(JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error("API test failed:", error);
      setResponse("Error: API test failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.apiTester}>
      <h3>APIテスター</h3>
      <div className={styles.requestSection}>
        <h4>リクエストボディ:</h4>
        <textarea
          value={requestBody}
          onChange={(e) => setRequestBody(e.target.value)}
          placeholder="JSONフォーマットでリクエストボディを入力してください"
        />
      </div>
      <button onClick={handleTest} disabled={loading}>
        {loading ? "テスト中..." : "APIをテスト"}
      </button>
      <div className={styles.responseSection}>
        <h4>レスポンス:</h4>
        <pre>{response}</pre>
      </div>
    </div>
  );
};

export default ApiTester;
