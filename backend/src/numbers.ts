// Utility functions for extracting and verifying numbers in text.

/**
 * Extracts all numeric sequences from the given text. This includes
 * integers, floats with optional commas, and percentage values.
 *
 * @param text The input string to search.
 * @returns An array of matched numeric strings (without altering commas).
 */
export function extractNumbers(text: string): string[] {
  const regex = /(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?|\d+%/g;
  const matches = text.match(regex);
  return matches ? matches : [];
}

/**
 * Compares numbers extracted from the original and rewritten text to
 * determine if any values have changed. Commas in numbers are ignored
 * for comparison purposes.
 *
 * @param original The original user-provided text.
 * @param rewritten The rewritten text from the LLM.
 * @returns True if all numbers are identical; false otherwise.
 */
export function ensureNumbersUnchanged(original: string, rewritten: string): boolean {
  const normalizeNumber = (n: string) => n.replace(/,/g, "");
  const orig = extractNumbers(original).map(normalizeNumber);
  const rew = extractNumbers(rewritten).map(normalizeNumber);
  if (orig.length !== rew.length) return false;
  for (let i = 0; i < orig.length; i++) {
    if (orig[i] !== rew[i]) return false;
  }
  return true;
}
