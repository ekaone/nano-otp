/**
 * Constant-time string comparison to prevent timing attacks.
 *
 * Iterates the full length of both strings regardless of where
 * a mismatch occurs, so execution time does not reveal how many
 * characters matched. Note: length difference is detectable via
 * timing, but OTP length is typically public knowledge so this
 * is an acceptable tradeoff.
 */
export function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;

  let result = 0;

  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}
