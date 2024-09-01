import { Workflow } from "../models/workflow";
import { WorkflowExecutor } from "../utils/workflow_executor";
import { v4 as uuidv4 } from "uuid";

export class WorkflowService {
  private workflows: { [key: string]: Workflow } = {};

  async createWorkflow(workflow: Workflow): Promise<Workflow> {
    const workflowId = uuidv4();
    this.workflows[workflowId] = workflow;

    // ワークフローを実行
    await WorkflowExecutor.executeWorkflow(workflow);

    return workflow;
  }

  async getWorkflow(workflowId: string): Promise<Workflow | undefined> {
    return this.workflows[workflowId];
  }

  async listWorkflows(): Promise<Workflow[]> {
    return Object.values(this.workflows);
  }

  async updateWorkflow(
    workflowId: string,
    workflow: Workflow
  ): Promise<Workflow | undefined> {
    if (workflowId in this.workflows) {
      this.workflows[workflowId] = workflow;
      return workflow;
    }
    return undefined;
  }

  async deleteWorkflow(workflowId: string): Promise<boolean> {
    if (workflowId in this.workflows) {
      delete this.workflows[workflowId];
      return true;
    }
    return false;
  }
}
