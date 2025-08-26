import { RewriteResponse } from "./types";

export interface LLMProvider {
  rewrite(prompt: string): Promise<RewriteResponse>;
}

export type ProviderName = "mock" | "openai";

export class MockProvider implements LLMProvider {
  async rewrite(prompt: string): Promise<RewriteResponse> {
    return {
      rewrittenText: prompt,
      usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
      warnings: [],
    };
  }
}
