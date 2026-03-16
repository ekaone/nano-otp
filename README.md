# @ekaone/nano-otp

A tiny, zero-dependency One-Time Password (OTP) library for JavaScript and TypeScript.

**@ekaone/nano-otp** is designed to be lightweight, secure, and easy to integrate into modern applications. It uses Node.js built-in `crypto` for cryptographically secure random generation — no external dependencies required.

> ⚠️ **Status: Under Active Development**
> APIs and features may change before v1.0.0.
> Track progress at: https://github.com/ekaone/nano-otp

---

## Installation

```bash
# pnpm
pnpm add @ekaone/nano-otp

# npm
npm install @ekaone/nano-otp

# yarn
yarn add @ekaone/nano-otp

# bun
bun add @ekaone/nano-otp
```

---

## Usage

### Generate an OTP

```javascript
import { generate } from "@ekaone/nano-otp";

// default: 6-digit numeric OTP
const otp = generate();
console.log(otp);
// => "482910"

// custom length
const otp8 = generate({ length: 8 });
console.log(otp8);
// => "30571846"

// alpha charset (uppercase letters)
const otpAlpha = generate({ charset: "alpha" });
console.log(otpAlpha);
// => "KXRTBM"

// alphanumeric charset
const otpAlphaNum = generate({ charset: "alphanumeric", length: 8 });
console.log(otpAlphaNum);
// => "4BX9K2RZ"

// custom charset
const otpCustom = generate({ charset: "ABCDEF0123", length: 6 });
console.log(otpCustom);
// => "C3A0FB"
```

### Verify an OTP

```javascript
import { verify } from "@ekaone/nano-otp";

// basic match
const isValid = verify({ input: "482910", code: "482910" });
console.log(isValid);
// => true

// mismatch
const isInvalid = verify({ input: "000000", code: "482910" });
console.log(isInvalid);
// => false

// with expiry (expiresAt is a Unix timestamp in milliseconds)
const isValidWithExpiry = verify({
  input: "482910",
  code: "482910",
  expiresAt: Date.now() + 5 * 60 * 1000, // expires in 5 minutes
});
console.log(isValidWithExpiry);
// => true

// expired OTP
const isExpired = verify({
  input: "482910",
  code: "482910",
  expiresAt: Date.now() - 1000, // already expired
});
console.log(isExpired);
// => false
```

### Generate a batch of OTPs

```javascript
import { batch } from "@ekaone/nano-otp";

// generate 5 OTPs (may contain duplicates)
const otps = batch(5);
console.log(otps);
// => ["482910", "039471", "182930", "482910", "748201"]

// with options
const otpsAlpha = batch(3, { charset: "alpha", length: 8 });
console.log(otpsAlpha);
// => ["KXRTBMQZ", "LNVWACPD", "ERJHMKXB"]
```

### Generate a batch of unique OTPs

```javascript
import { batchUnique } from "@ekaone/nano-otp";

// generate 5 guaranteed-unique OTPs
const uniqueOtps = batchUnique(5);
console.log(uniqueOtps);
// => ["482910", "039471", "182930", "748201", "910284"]
```

### Full workflow example

```javascript
import { generate, verify } from "@ekaone/nano-otp";

// 1. generate and store OTP with a 10-minute expiry
const code = generate({ length: 6 });
const expiresAt = Date.now() + 10 * 60 * 1000;

console.log("Send this code to the user:", code);
// => "Send this code to the user: 482910"

// 2. later, verify what the user submitted
const userInput = "482910"; // submitted by user

const result = verify({ input: userInput, code, expiresAt });
console.log("Verification passed:", result);
// => "Verification passed: true"
```

---

## API

### `generate(options?)`

Generates a single cryptographically secure OTP.

```ts
generate(options?: OTPOptions): string
```

| Option    | Type                                      | Default     | Description                              |
| --------- | ----------------------------------------- | ----------- | ---------------------------------------- |
| `length`  | `number`                                  | `6`         | Length of the generated OTP              |
| `charset` | `"numeric" \| "alpha" \| "alphanumeric" \| string` | `"numeric"` | Character set to use, or a custom string |

---

### `verify(options)`

Verifies an OTP using constant-time comparison to prevent timing attacks.

```ts
verify(options: VerifyOptions): boolean
```

| Option      | Type     | Required | Description                                              |
| ----------- | -------- | -------- | -------------------------------------------------------- |
| `input`     | `string` | ✅       | The OTP submitted by the user                            |
| `code`      | `string` | ✅       | The original generated OTP to compare against            |
| `expiresAt` | `number` | —        | Unix timestamp (ms) after which the OTP is invalid       |
| `now`       | `number` | —        | Override current time (ms) — useful for testing          |

---

### `batch(count, options?)`

Generates multiple OTPs. May contain duplicates.

```ts
batch(count: number, options?: OTPOptions): string[]
```

| Parameter | Type        | Description                        |
| --------- | ----------- | ---------------------------------- |
| `count`   | `number`    | Number of OTPs to generate         |
| `options` | `OTPOptions`| Same options as `generate`         |

---

### `batchUnique(count, options?)`

Generates multiple guaranteed-unique OTPs. Throws if the requested count exceeds the number of possible combinations for the given charset and length.

```ts
batchUnique(count: number, options?: OTPOptions): string[]
```

| Parameter | Type         | Description                        |
| --------- | ------------ | ---------------------------------- |
| `count`   | `number`     | Number of unique OTPs to generate  |
| `options` | `OTPOptions` | Same options as `generate`         |

---

## Types

```ts
interface OTPOptions {
  length?: number;
  charset?: "numeric" | "alpha" | "alphanumeric" | string;
}

interface VerifyOptions {
  input: string;
  code: string;
  expiresAt?: number;
  now?: number;
}
```

---

## Security

- Random generation uses Node.js `crypto.randomInt` — cryptographically secure, not `Math.random()`
- `verify` uses constant-time comparison (XOR-based) to prevent timing attacks
- Zero runtime dependencies — no supply chain risk from third-party packages

---

## License

MIT © Eka Prasetia — see [LICENSE](./LICENSE) for details.

---

## Links

- [NPM Package](https://www.npmjs.com/package/@ekaone/nano-otp)
- [GitHub Repository](https://github.com/ekaone/nano-otp)
- [Issue Tracker](https://github.com/ekaone/nano-otp/issues)