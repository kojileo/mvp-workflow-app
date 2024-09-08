export interface Parameter {
  name: string;
  type: string;
  description: string;
  required: boolean;
  default?: string | number;
}

export interface Header {
  name: string;
  value: string;
  type: string;
  description?: string;
}

export interface BodyItem {
  name: string;
  value: string | number;
}

export interface NodeParameter {
  nodeName: string;
  nodeType: string;
  nodeParameter: Record<string, any>;
  entryPoint: boolean;
}

export interface API {
  apiEndPoint: string;
  description: string;
  apiType: string;
  apiRequestParameters: Parameter[];
  apiRequestHeaders: Header[];
  apiRequestBody: BodyItem[];
  apiResponseHeaders: Header[];
  apiResponseBody: BodyItem[];
  flow: {
    node: {
      nodeName: string;
      nodeType: string;
      nodeParameter: Record<string, any>;
      entryPoint: boolean;
    };
  }[]; // 修正
}
