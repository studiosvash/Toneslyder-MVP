import { LLMProvider } from "./providers";
import { RewriteResponse } from "./types";
import { env } from "./env";

export class OpenAIProvider implements LLMProvider {
  async rewrite(prompt: string): Promise<RewriteResponse> {
    const response = await fetch(`${env.apiBase || 'https://api.openai.com/v1'}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.apiKey}`,
      },
      body: JSON.stringify({
        model: env.modelId || 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a helpful assistant that rewrites text with a given tone.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 1024,
        temperature: 0.3,
      }),
    });
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    return {
      output: content.trim(),
      usage: {
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0,
      },
      warnings: [],
    };
  }
}
