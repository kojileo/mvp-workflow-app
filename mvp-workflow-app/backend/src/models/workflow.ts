export interface Input {
  name: string;
  type: string;
}

export interface Output {
  name: string;
  type: string;
}

export interface Step {
  name: string;
  description: string;
  command: string;
  inputs: Input[];
  outputs: Output[];
  dependencies: string[];
  status: "保留中" | "実行中" | "完了" | "失敗";
  processing_time: "短" | "中" | "長";
}

export interface Workflow {
  name: string;
  description: string;
  steps: Step[];
}
