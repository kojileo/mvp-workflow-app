import React, { useState, useRef } from "react";
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTest = async () => {
    setLoading(true);
    try {
      const headers = apiInfo.apiRequestHeaders.reduce((acc, header) => {
        acc[header.name] = header.value;
        return acc;
      }, {} as Record<string, string>);

      const apiEndpoint = `/api/v1/${apiInfo.apiEndPoint.replace(/^\//, "")}`;

      let data;
      if (apiInfo.flow.some((item) => item.node.nodeParameter?.fileInput)) {
        const formData = new FormData();
        if (selectedFile) {
          formData.append("file", selectedFile);
        }
        data = formData;
        headers["Content-Type"] = "multipart/form-data";
      } else {
        data = JSON.parse(requestBody);
      }

      const response = await axios({
        method: apiInfo.apiType,
        url: `http://localhost:8000${apiEndpoint}`,
        headers: headers,
        data: data,
      });

      setResponse(JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error("API test failed:", error);
      setResponse("Error: API test failed");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const isFileInput = apiInfo.flow.some(
    (item) => item.node.nodeParameter?.fileInput
  );

  return (
    <div className={styles.apiTester}>
      <h3>APIテスター</h3>
      <div className={styles.requestSection}>
        {isFileInput ? (
          <>
            <h4>ファイル入力:</h4>
            <input type="file" onChange={handleFileChange} ref={fileInputRef} />
          </>
        ) : (
          <>
            <h4>リクエストボディ:</h4>
            <textarea
              value={requestBody}
              onChange={(e) => setRequestBody(e.target.value)}
              placeholder="JSONフォーマットでリクエストボディを入力してください"
            />
          </>
        )}
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
