export function calculateMaxCombinations(
  charsetLength: number,
  length: number,
): number {
  return Math.pow(charsetLength, length);
}
