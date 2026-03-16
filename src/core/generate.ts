import { randomInt } from "crypto";
import type { OTPOptions } from "../types/otp.types";
import { resolveCharset } from "../utils/resolveCharset";

export function generate(options: OTPOptions = {}): string {
  const length = options.length ?? 6;

  if (!Number.isInteger(length) || length < 1) {
    throw new Error("length must be a positive integer");
  }

  const charset = resolveCharset(options);

  if (charset.length === 0) {
    throw new Error("charset must not be empty");
  }

  let result = "";

  for (let i = 0; i < length; i++) {
    result += charset[randomInt(0, charset.length)];
  }

  return result;
}
