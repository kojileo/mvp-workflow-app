import express from "express";
import { json } from "body-parser";
import cors from "cors";
import { WorkflowService } from "./services/workflow_service";
import { WorkflowExecutor } from "./utils/workflow_executor";
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
        const result = await WorkflowExecutor.executeWorkflow(workflow);
        res.json(result);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Workflow execution failed" });
      }
    });

    res.json({
      message: "API created successfully",
      apiEndPoint: createdApiEndpoint,
      workflow: createdWorkflow,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
