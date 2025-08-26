// Conflict resolution logic for ToneSlyder

export interface ConflictResult {
  primary: Record<string, string>;
  secondary: Record<string, string>;
  notes?: string[];
}

/**
 * Detect conflicts among the mapped tone buckets. Currently identifies cases
 * where formality and conversational sliders are both high, which generally
 * conflict. Returns an array of conflict identifiers.
 */
export function detectConflicts(buckets: Record<string, string>): string[] {
  const conflicts: string[] = [];
  const highLevels = ["high", "very high"];
  if (
    buckets.formality && highLevels.includes(buckets.formality) &&
    buckets.conversational && highLevels.includes(buckets.conversational)
  ) {
    conflicts.push("formality-conversational");
  }
  return conflicts;
}

/**
 * Resolve conflicting tone instructions by sorting the buckets into primary
 * and secondary groups. The primary group contains the most important tones
 * based on a simple priority order (formality > conversational > informativeness >
 * authoritativeness). Secondary contains the rest. A notes array describes
 * any adjustments made due to conflicts.
 */
export function resolveConflicts(buckets: Record<string, string>): ConflictResult {
  const conflicts = detectConflicts(buckets);
  const primary: Record<string, string> = {};
  const secondary: Record<string, string> = {};
  const notes: string[] = [];
  // Define tone priority order
  const priority = ["formality", "conversational", "informativeness", "authoritativeness"];

    const highLevels = ["high", "very high"];

  // Assign each bucket to primary if no primary has been filled for that key and
  // the value is high or very high, otherwise it goes to secondary.
  priority.forEach(key => {
    const value = buckets[key];
    if (!value) return;
    if (highLevels.includes(value) && primary[key] === undefined) {
      primary[key] = value;
    } else {
      secondary[key] = value;
    }
  });

  if (conflicts.length > 0) {
    notes.push(
      "Conflicting sliders detected; prioritizing formal tone over conversational tone."
    );
  }

  return { primary, secondary, notes: notes.length ? notes : undefined };
}
