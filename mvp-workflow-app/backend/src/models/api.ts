export interface Parameter {
  name: string;
  type: string;
  description: string;
  required: boolean;
  defaultValue?: string | number | boolean;
}

export interface Header {
  name: string;
  value: string;
  type?: string; // typeをオプショナルに変更
  description?: string;
}

export interface BodyItem {
  name: string;
  type: string;
  description?: string;
  required?: boolean;
  value: string | number; // undefinedを削除
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
  flow: Record<string, any>[];
}
