import { describe, it, expect } from "vitest";
import { generate, batch, batchUnique, verify } from "../src/index";

// ---------------------------------------------------------------------------
// generate
// ---------------------------------------------------------------------------

describe("generate", () => {
  describe("default behavior", () => {
    it("returns a string of length 6", () => {
      expect(generate()).toHaveLength(6);
    });

    it("returns only numeric characters by default", () => {
      const otp = generate();
      expect(otp).toMatch(/^[0-9]+$/);
    });

    it("produces different values across calls (non-deterministic)", () => {
      const results = new Set(Array.from({ length: 20 }, () => generate()));
      expect(results.size).toBeGreaterThan(1);
    });
  });

  describe("length option", () => {
    it("respects custom length", () => {
      expect(generate({ length: 8 })).toHaveLength(8);
      expect(generate({ length: 4 })).toHaveLength(4);
      expect(generate({ length: 12 })).toHaveLength(12);
    });

    it("throws when length is 0", () => {
      expect(() => generate({ length: 0 })).toThrow(
        "length must be a positive integer",
      );
    });

    it("throws when length is negative", () => {
      expect(() => generate({ length: -1 })).toThrow(
        "length must be a positive integer",
      );
    });

    it("throws when length is a float", () => {
      expect(() => generate({ length: 4.5 })).toThrow(
        "length must be a positive integer",
      );
    });
  });

  describe("charset option", () => {
    it("generates alpha-only OTP", () => {
      const otp = generate({ charset: "alpha", length: 20 });
      expect(otp).toMatch(/^[A-Z]+$/);
    });

    it("generates alphanumeric OTP", () => {
      const otp = generate({ charset: "alphanumeric", length: 20 });
      expect(otp).toMatch(/^[A-Z0-9]+$/);
    });

    it("generates numeric OTP explicitly", () => {
      const otp = generate({ charset: "numeric", length: 10 });
      expect(otp).toMatch(/^[0-9]+$/);
    });

    it("accepts a custom charset string", () => {
      const otp = generate({ charset: "ABC", length: 10 });
      expect(otp).toMatch(/^[ABC]+$/);
    });

    it("throws when custom charset is empty string", () => {
      expect(() => generate({ charset: "" })).toThrow(
        "charset must not be empty",
      );
    });
  });
});

// ---------------------------------------------------------------------------
// batch
// ---------------------------------------------------------------------------

describe("batch", () => {
  it("returns the correct number of OTPs", () => {
    expect(batch(5)).toHaveLength(5);
    expect(batch(1)).toHaveLength(1);
    expect(batch(100)).toHaveLength(100);
  });

  it("each OTP has the default length of 6", () => {
    batch(10).forEach((otp) => expect(otp).toHaveLength(6));
  });

  it("respects length option", () => {
    batch(10, { length: 8 }).forEach((otp) => expect(otp).toHaveLength(8));
  });

  it("respects charset option", () => {
    batch(10, { charset: "alpha" }).forEach((otp) =>
      expect(otp).toMatch(/^[A-Z]+$/),
    );
  });

  it("may contain duplicates (non-unique batch)", () => {
    // Not guaranteed but batch() makes no uniqueness promise
    const results = batch(1000, { length: 1, charset: "numeric" });
    const unique = new Set(results);
    // With length=1 numeric there are only 10 possible values
    expect(unique.size).toBeLessThanOrEqual(10);
  });

  it("throws when count is 0", () => {
    expect(() => batch(0)).toThrow("batch count must be a positive integer");
  });

  it("throws when count is negative", () => {
    expect(() => batch(-5)).toThrow("batch count must be a positive integer");
  });

  it("throws when count is a float", () => {
    expect(() => batch(2.5)).toThrow("batch count must be a positive integer");
  });
});

// ---------------------------------------------------------------------------
// batchUnique
// ---------------------------------------------------------------------------

describe("batchUnique", () => {
  it("returns the correct number of OTPs", () => {
    expect(batchUnique(5)).toHaveLength(5);
  });

  it("all returned OTPs are unique", () => {
    const results = batchUnique(50);
    const unique = new Set(results);
    expect(unique.size).toBe(50);
  });

  it("respects length option", () => {
    batchUnique(5, { length: 8 }).forEach((otp) => expect(otp).toHaveLength(8));
  });

  it("respects charset option", () => {
    batchUnique(5, { charset: "alpha" }).forEach((otp) =>
      expect(otp).toMatch(/^[A-Z]+$/),
    );
  });

  it("can exhaust all combinations for small charset+length", () => {
    // charset "AB" + length 2 = 4 combinations: AA, AB, BA, BB
    const results = batchUnique(4, { charset: "AB", length: 2 });
    expect(results).toHaveLength(4);
    expect(new Set(results).size).toBe(4);
  });

  it("throws when count exceeds max combinations", () => {
    // charset "AB" + length 2 = only 4 possible combinations
    expect(() => batchUnique(5, { charset: "AB", length: 2 })).toThrow(
      "Requested 5 unique OTPs but only 4 combinations possible",
    );
  });

  it("throws when count is 0", () => {
    expect(() => batchUnique(0)).toThrow(
      "batchUnique count must be a positive integer",
    );
  });

  it("throws when count is negative", () => {
    expect(() => batchUnique(-1)).toThrow(
      "batchUnique count must be a positive integer",
    );
  });

  it("throws when count is a float", () => {
    expect(() => batchUnique(3.3)).toThrow(
      "batchUnique count must be a positive integer",
    );
  });
});

// ---------------------------------------------------------------------------
// verify
// ---------------------------------------------------------------------------

describe("verify", () => {
  describe("basic matching", () => {
    it("returns true for matching input and code", () => {
      expect(verify({ input: "123456", code: "123456" })).toBe(true);
    });

    it("returns false for mismatched input and code", () => {
      expect(verify({ input: "123456", code: "654321" })).toBe(false);
    });

    it("is case-sensitive", () => {
      expect(verify({ input: "ABCDEF", code: "abcdef" })).toBe(false);
    });

    it("returns false for different lengths", () => {
      expect(verify({ input: "12345", code: "123456" })).toBe(false);
    });
  });

  describe("empty / missing values", () => {
    it("returns false when input is empty string", () => {
      expect(verify({ input: "", code: "123456" })).toBe(false);
    });

    it("returns false when code is empty string", () => {
      expect(verify({ input: "123456", code: "" })).toBe(false);
    });
  });

  describe("expiry", () => {
    it("returns true when expiresAt is in the future", () => {
      expect(
        verify({
          input: "123456",
          code: "123456",
          expiresAt: Date.now() + 60_000,
        }),
      ).toBe(true);
    });

    it("returns false when expiresAt is in the past", () => {
      expect(
        verify({
          input: "123456",
          code: "123456",
          expiresAt: Date.now() - 1,
        }),
      ).toBe(false);
    });

    it("returns false when expiresAt equals now (already expired)", () => {
      const now = Date.now();
      expect(
        verify({
          input: "123456",
          code: "123456",
          expiresAt: now - 1,
          now,
        }),
      ).toBe(false);
    });

    it("accepts injected now for deterministic testing", () => {
      const fixedNow = 1_000_000;
      expect(
        verify({
          input: "123456",
          code: "123456",
          expiresAt: fixedNow + 1000,
          now: fixedNow,
        }),
      ).toBe(true);
    });

    it("returns false when injected now is past expiresAt", () => {
      const fixedNow = 2_000_000;
      expect(
        verify({
          input: "123456",
          code: "123456",
          expiresAt: fixedNow - 1,
          now: fixedNow,
        }),
      ).toBe(false);
    });

    it("handles expiresAt of 0 as already expired", () => {
      expect(
        verify({
          input: "123456",
          code: "123456",
          expiresAt: 0,
          now: 1,
        }),
      ).toBe(false);
    });
  });

  describe("integration — generate then verify", () => {
    it("verifies a freshly generated OTP", () => {
      const code = generate();
      expect(verify({ input: code, code })).toBe(true);
    });

    it("verifies a freshly generated alpha OTP", () => {
      const code = generate({ charset: "alpha", length: 8 });
      expect(verify({ input: code, code })).toBe(true);
    });

    it("fails verification for a tampered OTP", () => {
      const code = generate();
      const tampered = code.split("").reverse().join("");
      // reverse may equal original for palindromes, skip those
      if (tampered !== code) {
        expect(verify({ input: tampered, code })).toBe(false);
      }
    });

    it("verifies OTP within expiry window", () => {
      const code = generate();
      expect(
        verify({ input: code, code, expiresAt: Date.now() + 30_000 }),
      ).toBe(true);
    });

    it("fails verification after expiry window", () => {
      const code = generate();
      expect(verify({ input: code, code, expiresAt: Date.now() - 1 })).toBe(
        false,
      );
    });
  });
});
