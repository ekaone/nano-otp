import { VerifyOptions } from "../types/otp.types";
import { safeCompare } from "../utils/safeCompare";

export function verify(options: VerifyOptions): boolean {
  const { input, code, expiresAt, now = Date.now() } = options;

  if (!input || !code) {
    return false;
  }

  if (expiresAt && now > expiresAt) {
    return false;
  }

  return safeCompare(input, code);
}
