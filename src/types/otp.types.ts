export interface OTPOptions {
  length?: number;
  charset?: "numeric" | "alpha" | "alphanumeric" | string;
}

export interface VerifyOptions {
  input: string;
  code: string;
  expiresAt?: number;
  now?: number;
}
