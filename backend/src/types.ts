export interface Guardrails {
  required?: string[];
  banned?: string[];
}

export interface RewriteRequest {
  text: string;
  sliders: Record<string, number>;
  guardrails?: Guardrails;
  integration?: string;
}

export interface LLMUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  cost?: number;
}

export interface Warning {
  code: string;
  message: string;
}

export interface RewriteResponse {
  rewrittenText: string;
  usage?: LLMUsage;
  warnings?: Warning[];
}
