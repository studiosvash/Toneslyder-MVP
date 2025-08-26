import { RewriteRequest, RewriteResponse, Guardrails } from "./types";
import { normalize } from "./normalize";
import { mapToBuckets } from "./buckets";
import { buildPrompt } from "./prompt";
import { MockProvider } from "./providers";
import { OpenAIProvider } from "./provider.openai";
import { env } from "./env";

export async function rewritePipeline(req: RewriteRequest): Promise<RewriteResponse> {
  const { text, sliders, guardrails = {} as Guardrails } = req;
  // normalize slider values (0-100 to -1 to 1)
  const normalized: Record<string, number> = {};
  for (const key in sliders) {
    normalized[key] = (sliders[key] - 50) / 50;
  }
  // map to buckets
  const buckets = mapToBuckets(normalized as any);
  // build prompt
  let prompt = buildPrompt(text, buckets, guardrails);
  // choose provider based on env
  let provider;
  if (env.providerMode === "openai") {
    provider = new OpenAIProvider();
  } else {
    provider = new MockProvider();
  }
  // call provider
  const result = await provider.rewrite(prompt);
  // simple response
  return {
    output: result.output,
    usage: result.usage,
    warnings: result.warnings ?? [],
  };
}
