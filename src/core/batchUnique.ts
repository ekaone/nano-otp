import { OTPOptions } from "../types/otp.types";
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
      `Requested ${count} unique OTPs but only ${max} combinations possible`,
    );
  }

  const results = new Set<string>();

  while (results.size < count) {
    results.add(generate(options));
  }

  return Array.from(results);
}
