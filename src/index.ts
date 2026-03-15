/**
 * index.ts
 * @description Entry point for the application.
 * @author Your Name
 * @date 2024-06-01
 * @version 1.0.0
 */

import { generate } from "./core/generate";
import { batch } from "./core/batch";
import { batchUnique } from "./core/batchUnique";
import { verify } from "./core/verify";

export const otp = {
  generate,
  batch,
  batchUnique,
  verify,
};

export { generate, batch, batchUnique, verify };
