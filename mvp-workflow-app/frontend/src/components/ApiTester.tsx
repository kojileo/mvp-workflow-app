import React, { useState } from "react";
import axios from "axios";
import styles from "../styles/ApiTester.module.css";

interface ApiTesterProps {
  apiEndpoint: string;
}

const ApiTester: React.FC<ApiTesterProps> = ({ apiEndpoint }) => {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`http://localhost:8000${apiEndpoint}`, {
        text: inputText,
      });
      setResult(response.data);
    } catch (error) {
      console.error("API call failed:", error);
      setResult({ error: "API call failed" });
    }
    setIsLoading(false);
  };

  return (
    <div className={styles.apiTester}>
      <h3>APIテスト</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="テストするテキストを入力してください"
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "処理中..." : "テスト実行"}
        </button>
      </form>
      {result && (
        <div className={styles.result}>
          <h4>結果:</h4>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ApiTester;
