import type { OTPOptions } from "../types/otp.types";

const NUMERIC = "0123456789";
const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const ALPHANUMERIC = NUMERIC + ALPHA;

export function resolveCharset(options: OTPOptions = {}): string {
  switch (options.charset) {
    case "alpha":
      return ALPHA;
    case "alphanumeric":
      return ALPHANUMERIC;
    case "numeric":
      return NUMERIC;
    default:
      // custom charset string passed directly
      if (typeof options.charset === "string" && options.charset.length > 0) {
        return options.charset;
      }
      // undefined or empty string → fallback to numeric
      return NUMERIC;
  }
}
