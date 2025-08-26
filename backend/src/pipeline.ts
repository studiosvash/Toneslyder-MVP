import { normalizeAll } from "./normalize";
import { mapToBuckets } from "./buckets";
import { buildPrompt } from "./prompt";
import { MockProvider } from "./providers";
import { OpenAIProvider } from "./provider.openai";
import { env } from "./env";
import { RewriteRequest, RewriteResponse } from "./types";

export async function rewritePipeline(req: RewriteRequest): Promise<RewriteResponse> {
  const { tXext, sliders = {}, guardrails = {} } = req;
  // Normalize slider values (0-100 to -1..1)
  const normalized = normalizeAll(sliders);
  const buckets = mapToBuckets(normalized as any);
  const prompt = buildPrompt(text, buckets, guardrails);

  let provider;
  if (env.providerMode === "real") {
    provider = new OpenAIProvider();
  } else {
    provider = new MockProvider();
  }

  const result = await provider.rewrite(prompt);

  return {
    rewrittenText: result.rewrittenText,
    usage: result.usage,
    warnings: result.warnings ?? [],
  };
}
