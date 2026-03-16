
# @ekaone/nano-otp

A tiny, dependency-free One-Time Password (OTP) library for JavaScript and TypeScript environments.

**@ekaone/nano-otp** is designed to be lightweight, simple, and easy to integrate into modern applications. It works in both **Node.js** and **browser environments**, making it suitable for authentication flows, verification systems, and security-sensitive workflows.

> ⚠️ **Status: Under Active Development**  
> This project is currently under active development. APIs and features may change.  
> Track progress and updates at:  
> https://github.com/ekaone/nano-otp

---

# Installation

Install the package using your preferred package manager:

```bash
# pnpm
pnpm add -g @ekaone/nano-otp

# yarn
yarn global add @ekaone/nano-otp

# npm
npm install -g @ekaone/nano-otp

# bun
bun add -g @ekaone/nano-otp
```

---

# Usage

Import the library in your project:

```javascript
import { generateOTP, verifyOTP } from "@ekaone/nano-otp";
```

Generate an OTP:

```javascript
const otp = generateOTP();

console.log(otp);
```

Verify an OTP:

```javascript
const isValid = verifyOTP("123456");

console.log(isValid);
```

Example workflow:

```javascript
import { generateOTP, verifyOTP } from "@ekaone/nano-otp";

const otp = generateOTP();

console.log("Generated OTP:", otp);

const valid = verifyOTP(otp);

console.log("Verification result:", valid);
```

For more examples and implementation details, see:

[https://github.com/ekaone/nano-otp](https://github.com/ekaone/nano-otp)

---

# API

## `generateOTP()`

Generates a One-Time Password.

```ts
generateOTP(): string
```

Returns:

```
string
```

Example:

```javascript
const otp = generateOTP();
```

---

## `verifyOTP(code)`

Verifies a provided OTP code.

```ts
verifyOTP(code: string): boolean
```

Parameters:

| Parameter | Type   | Description        |
| --------- | ------ | ------------------ |
| code      | string | OTP code to verify |

Returns:

```
boolean
```

Example:

```javascript
verifyOTP("123456");
```

---

# Documentation

Full documentation, issues, and development updates are available at:

[https://github.com/ekaone/nano-otp](https://github.com/ekaone/nano-otp)

---

# License

MIT © Eka Prasetia — see [LICENSE](./LICENSE) for details.

# Links

- [NPM Package](https://www.npmjs.com/package/@ekaone/nano-otp)
- [GitHub Repository](https://github.com/ekaone/nano-otp)
- [Issue Tracker](https://github.com/ekaone/nano-otp/issues)
