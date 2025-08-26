export function normalize(value: number): number {
  // Normalize slider value from 0-100 to -1..1
  return (value - 50) / 50;
}

export function normalizeAll(sliders: Record<string, number>): Record<string, number> {
  const result: Record<string, number> = {};
  for (const key in sliders) {
    if (Object.prototype.hasOwnProperty.call(sliders, key)) {
      result[key] = normalize(sliders[key]);
    }
  }
  return result;
}
