import { OTPOptions } from "../types/otp.types";
import { generate } from "./generate";

export function batch(count: number, options: OTPOptions = {}): string[] {
  if (!Number.isInteger(count) || count <= 0) {
    throw new Error("batch count must be a positive integer");
  }

  const results: string[] = [];

  for (let i = 0; i < count; i++) {
    results.push(generate(options));
  }

  return results;
}
