// Simple token estimation utilities

export function countTokens(text: string): number {
  // naive token count: number of whitespace-separated words
  if (!text) return 0;
  return text.trim().split(/\s+/).length;
}

export function estimatePromptTokens(prompt: string): number {
  return countTokens(prompt);
}
