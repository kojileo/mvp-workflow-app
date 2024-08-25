import { Node, Edge } from "reactflow";

export interface WorkflowNodeData {
  label: string;
  type: string;
}

export interface Header {
  name: string;
  type: string;
  description: string;
  required?: boolean; // requiredフィールドをオプションに変更
  default?: string;
  value?: string;
}

export type NodeType =
  | "start"
  | "llm"
  | "codeExecution"
  | "httpRequest"
  | "template"
  | "database"
  | "email"
  | "end";

export interface NodeData {
  label: string;
  type: NodeType;
  params: Record<string, any>;
}

export interface WorkflowNode extends Node<NodeData> {}

export type WorkflowEdge = Edge;

export interface Workflow {
  apiEndPoint: string;
  description: string;
  apiType: string;
  apiRequestParameters: Array<{
    name: string;
    type: string;
    description: string;
    required: boolean;
    default?: number | string;
  }>;
  apiRequestHeaders: Header[];
  apiRequestBody: Array<Record<string, string>>;
  apiResponseHeaders: Header[];
  apiResponseBody: Array<Record<string, string>>;
  flow: {
    node: {
      nodeName: string;
      nodeType: string;
      nodeParameter: Record<string, any>; // 配列から単一のオブジェクトに変更
      entryPoint: boolean;
    };
  }[];
}
