import express from "express";
import { json } from "body-parser";
import cors from "cors";
import { WorkflowService } from "./services/workflow_service";
import { WorkflowExecutor } from "./utils/workflow_executor";
import { API } from "./models/api";
import { Request, Response, Express } from "express";

const app: Express = express();
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
    const workflowData = req.body.workflow;
    console.log("Received workflow:", JSON.stringify(workflowData, null, 2));

    if (!workflowData || !workflowData.apiEndPoint || !workflowData.flow) {
      throw new Error("Invalid workflow data: apiEndPoint or flow is missing");
    }

    const workflow: API = workflowData;
    const createdWorkflow = await workflowService.createWorkflow(workflow);
    const createdApiEndpoint = `/api/v1/${workflow.apiEndPoint.replace(
      /^\//,
      ""
    )}`;

    // 動的にAPIエンドポイントを作成
    app[workflow.apiType.toLowerCase() as "get" | "post" | "put" | "delete"](
      createdApiEndpoint,
      async (req: Request, res: Response) => {
        try {
          const inputText =
            workflow.apiType === "GET"
              ? (req.query.text as string)
              : (req.body.text as string);
          const result = await WorkflowExecutor.executeWorkflow(
            workflow,
            inputText
          );
          res.json(result);
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Workflow execution failed" });
        }
      }
    );

    res.json({
      message: "API created successfully",
      apiEndPoint: createdApiEndpoint,
      apiType: workflow.apiType,
      workflow: createdWorkflow,
    });
  } catch (error: unknown) {
    console.error("Error creating API:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : String(error),
    });
  }
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
