import { API } from "../models/api";
import { AIService } from "../services/ai_service";

export class WorkflowExecutor {
  static async executeWorkflow(api: API, inputText?: string): Promise<any> {
    let result: any = { text: inputText || "Sample input text" };
    if (Array.isArray(api.flow)) {
      for (const step of api.flow) {
        if (step && step.node) {
          result = await this.executeStep(step.node, result);
        } else {
          console.error("Invalid step in api.flow:", step);
        }
      }
    } else {
      console.error("api.flow is not an array or is undefined:", api.flow);
    }
    return result;
  }

  private static async executeStep(node: any, input: any): Promise<any> {
    console.log(`Executing step: ${node.nodeName}`);
    switch (node.nodeType) {
      case "start":
        return { text: input.text || "Sample input text" };
      case "llm":
        return this.executeLLMNode(node, input);
      case "end":
        return input;
      default:
        throw new Error(`Unknown node type: ${node.nodeType}`);
    }
  }

  private static async executeLLMNode(node: any, input: any): Promise<any> {
    switch (node.nodeParameter.aiFunction) {
      case "summarize":
        const summary = await AIService.summarizeText(
          input.text,
          node.nodeParameter.maxLength || 100
        );
        return summary;
      // 他のAI機能も同様に実装できます
      default:
        throw new Error(
          `Unknown AI function: ${node.nodeParameter.aiFunction}`
        );
    }
  }
}
