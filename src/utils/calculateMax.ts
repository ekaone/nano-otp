export function calculateMaxCombinations(
  charsetLength: number,
  length: number,
): number {
  if (charsetLength < 1 || length < 1) {
    return 0;
  }

  // Math.pow can exceed Number.MAX_SAFE_INTEGER for large inputs
  // (e.g. charsetLength=62, length=20 → ~7×10^35).
  // Cap at MAX_SAFE_INTEGER to keep comparisons in batchUnique meaningful.
  const result = Math.pow(charsetLength, length);
  return Math.min(result, Number.MAX_SAFE_INTEGER);
}
