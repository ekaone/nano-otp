import type { OTPOptions } from "../types/otp.types";
import { generate } from "./generate";
import { resolveCharset } from "../utils/resolveCharset";
import { calculateMaxCombinations } from "../utils/calculateMax";

export function batchUnique(count: number, options: OTPOptions = {}): string[] {
  if (!Number.isInteger(count) || count <= 0) {
    throw new Error("batchUnique count must be a positive integer");
  }

  const length = options.length ?? 6;
  const charset = resolveCharset(options);
  const max = calculateMaxCombinations(charset.length, length);

  if (count > max) {
    throw new Error(
      `Requested ${count} unique OTPs but only ${max} combinations possible with charset length ${charset.length} and OTP length ${length}`,
    );
  }

  const results = new Set<string>();

  // Note: performance degrades as count approaches max combinations due to
  // increasing collision rate. Consider a shuffle-based approach for
  // high-density requests (count > max * 0.8).
  while (results.size < count) {
    results.add(generate(options));
  }

  return Array.from(results);
}
