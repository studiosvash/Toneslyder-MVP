export function countWords(text: string): number {
  // Use Intl.Segmenter when available for better word segmentation
  const anyIntl: any = Intl as any;
  if (anyIntl && anyIntl.Segmenter) {
    const segmenter = new anyIntl.Segmenter('en', { type: 'word' });
    let count = 0;
    for (const token of segmenter.segment(text)) {
      if ((token as any).isWordLike) count++;
    }
    return count;
  }
  // Fallback: split by whitespace
  const words = text.trim().match(/\S+/g);
  return words ? words.length : 0;
}
