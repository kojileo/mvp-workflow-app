import express from "express";
import { json } from "body-parser";
import cors from "cors";
import { WorkflowService } from "./services/workflow_service";
import { API } from "./models/api";

const app = express();
const port = 8000;

app.use(json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

const workflowService = new WorkflowService();

async function mockExecuteWorkflow(workflow: API): Promise<any> {
  const result: any = {};
  for (const step of workflow.flow) {
    const node = step.node;
    switch (node.nodeType) {
      case "start":
        result.input = "Sample input text";
        break;
      case "llm":
        switch (node.nodeParameter.aiFunction) {
          case "summarize":
            result.summary = `Summarized version of: ${result.input}`;
            break;
          case "translate":
            result.translatedText = `Translated to ${node.nodeParameter.targetLanguage}: ${result.input}`;
            break;
          case "analyze":
            result.analysis = `Analysis of: ${result.input}`;
            break;
          case "generate":
            result.generatedText = `Generated text based on: ${result.input}`;
            break;
          case "custom":
            result.customOutput = `Custom processing of: ${result.input}`;
            break;
        }
        break;
      case "end":
        // エンドノードの処理（必要に応じて）
        break;
    }
  }
  return result;
}

app.post("/createapi", async (req, res) => {
  try {
    const workflow: API = req.body.workflow;
    const createdWorkflow = await workflowService.createWorkflow(workflow);
    const createdApiEndpoint = `/api/v1/${workflow.apiEndPoint.replace(
      /^\//,
      ""
    )}`;

    // 動的にAPIエンドポイントを作成
    app.post(createdApiEndpoint, async (req, res) => {
      try {
        const result = await mockExecuteWorkflow(workflow);
        res.json(result);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Workflow execution failed" });
      }
    });

    res.json({
      message: "API created successfully",
      apiEndPoint: createdApiEndpoint,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
