import { Result } from "../types/result";

type WebCrypto = {
  getRandomValues?<T extends ArrayBufferView>(array: T): T;
};

export function generateRandomBytes(count: number): Uint8Array {
  if (!Number.isInteger(count) || count <= 0) {
    throw new Error("count must be a positive integer");
  }

  const byteArray = new Uint8Array(count);

  // --- Browser crypto API ---
  try {
    const globalCrypto = (globalThis as { crypto?: WebCrypto }).crypto;
    if (globalCrypto && typeof globalCrypto.getRandomValues === "function") {
      globalCrypto.getRandomValues(byteArray);
      return byteArray;
    }
  } catch (_) {
    // ignore and fallback to Node crypto
  }

  // --- Node.js crypto fallback ---
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const nodeCrypto = require("crypto") as typeof import("crypto");

    if (typeof nodeCrypto.randomFillSync === "function") {
      nodeCrypto.randomFillSync(byteArray);
      return byteArray;
    }

    if (typeof nodeCrypto.randomBytes === "function") {
      byteArray.set(nodeCrypto.randomBytes(byteArray.length));
      return byteArray;
    }
  } catch (_) {
    // ignore, next step handles failure
  }

  throw new Error("Unable to access a secure random source.");
}

export function safeGenerateRandomBytes(count: number): Result<Uint8Array> {
  try {
    return { success: true, data: generateRandomBytes(count) };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err : new Error("Unexpected error.") };
  }
}
