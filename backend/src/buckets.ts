export type Bucket = 'very low' | 'low' | 'neutral' | 'high' | 'very high';

export function toBucket(value: number): Bucket {
  if (value <= -0.6) return 'very low';
  if (value <= -0.2) return 'low';
  if (value < 0.2) return 'neutral';
  if (value < 0.6) return 'high';
  return 'very high';
}

export function mapToBuckets(vector: Record<string, number>): Record<string, Bucket> {
  const buckets: Record<string, Bucket> = {};
  for (const key in vector) {
    if (Object.prototype.hasOwnProperty.call(vector, key)) {
      buckets[key] = toBucket(vector[key]);
    }
  }
  return buckets;
}
