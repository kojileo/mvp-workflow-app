import { v4 as uuidv4 } from "uuid";
import { API } from "../models/api";
import { WorkflowExecutor } from "../utils/workflow_executor";

export class WorkflowService {
  private apis: { [key: string]: API } = {};

  async createWorkflow(api: API): Promise<API> {
    const apiId = uuidv4();
    this.apis[apiId] = api;

    // ワークフローを実行
    await WorkflowExecutor.executeWorkflow(api);

    return api;
  }

  async getWorkflow(apiId: string): Promise<API | undefined> {
    return this.apis[apiId];
  }

  async listWorkflows(): Promise<API[]> {
    return Object.values(this.apis);
  }

  async updateWorkflow(apiId: string, api: API): Promise<API | undefined> {
    if (apiId in this.apis) {
      this.apis[apiId] = api;
      return api;
    }
    return undefined;
  }

  async deleteWorkflow(apiId: string): Promise<boolean> {
    if (apiId in this.apis) {
      delete this.apis[apiId];
      return true;
    }
    return false;
  }
}
