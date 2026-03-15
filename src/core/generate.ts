import { OTPOptions } from "../types/otp.types";
import { resolveCharset } from "../utils/resolveCharset";

export function generate(options: OTPOptions = {}): string {
  const length = options.length ?? 6;
  const charset = resolveCharset(options);

  let result = "";

  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * charset.length);
    result += charset[index];
  }

  return result;
}
