const NUMERIC = "0123456789";
const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const ALPHANUMERIC = NUMERIC + ALPHA;

export function resolveCharset(options: any = {}): string {
  if (typeof options.charset === "string") {
    return options.charset;
  }

  switch (options.charset) {
    case "alpha":
      return ALPHA;
    case "alphanumeric":
      return ALPHANUMERIC;
    case "numeric":
    default:
      return NUMERIC;
  }
}
