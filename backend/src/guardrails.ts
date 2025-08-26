// Guardrail utilities for ToneSlyder

export interface Guardrails {
  required?: string[];
  banned?: string[];
}

/**
 * Generate prompt instructions for the given guardrails. Required terms are
 * included as "ensure" statements and banned terms as "avoid" statements.
 *
 * @param guardrails User-defined guardrails containing required and banned lists.
 * @returns A string to append to the prompt instructions or an empty string.
 */
export function formatGuardrailsPrompt(guardrails: Guardrails): string {
  const parts: string[] = [];
  if (guardrails.required && guardrails.required.length > 0) {
    parts.push(`Ensure the following keywords remain unchanged: ${guardrails.required.join(", ")}.`);
  }
  if (guardrails.banned && guardrails.banned.length > 0) {
    parts.push(`Avoid using the following words/phrases: ${guardrails.banned.join(", ")}.`);
  }
  return parts.join("\n");
}

/**
 * Check that all required terms appear in the output and that no banned terms
 * are present. Returns an object listing any missing required terms and
 * banned terms found.
 *
 * @param output The LLM's rewritten output.
 * @param guardrails The guardrails to verify against.
 */
export function checkGuardrails(
  output: string,
  guardrails: Guardrails
): { missingRequired: string[]; bannedPresent: string[] } {
  const missingRequired: string[] = [];
  const bannedPresent: string[] = [];
  if (guardrails.required) {
    for (const term of guardrails.required) {
      if (!output.includes(term)) {
        missingRequired.push(term);
      }
    }
  }
  if (guardrails.banned) {
    for (const term of guardrails.banned) {
      if (output.includes(term)) {
        bannedPresent.push(term);
      }
    }
  }
  return { missingRequired, bannedPresent };
}
