import { Guardrails } from "./types";
import { Bucket } from "./buckets";

function formatBuckets(buckets: Record<string, Bucket>): string {
  return Object.entries(buckets)
    .map(([key, value]) => `- ${key}: ${value}`)
    .join("\n");
}

export function buildPrompt(
  text: string,
  buckets: Record<string, Bucket>,
  guardrails: Guardrails
): string {
  let prompt = `Rewrite the following text with these tone settings:\n${formatBuckets(buckets)}\n\n`;
  if (guardrails.required && guardrails.required.length) {
    prompt += `Ensure the following keywords remain unchanged: ${guardrails.required.join(", ")}\n`;
  }
  if (guardrails.banned && guardrails.banned.length) {
    prompt += `Do not use the following words: ${guardrails.banned.join(", ")}\n`;
  }
  prompt += `\nText: """${text}"""`;
  return prompt;
}
