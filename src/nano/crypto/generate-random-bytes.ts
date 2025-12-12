import { NonThrowing } from "../types/non-throwing";
import { Result } from "../types/result";
import { Throwing } from "../types/throwing";

type WebCrypto = {
  getRandomValues?<T extends ArrayBufferView>(array: T): T;
};

type GenerateRandomBytesParams = {
  count: number;
} & (Throwing | NonThrowing);

function generateRandomBytesThrowing(params: GenerateRandomBytesParams & Throwing): Uint8Array {
  if (!Number.isInteger(params.count) || params.count <= 0) {
    throw new Error("count must be a positive integer");
  }

  const byteArray = new Uint8Array(params.count);

  try {
    const globalCrypto = (globalThis as { crypto?: WebCrypto }).crypto;
    if (globalCrypto && typeof globalCrypto.getRandomValues === "function") {
      globalCrypto.getRandomValues(byteArray);
      return byteArray;
    }
  } catch (_) {
    // Do nothing
  }

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
    // Do nothing
  }

  throw new Error("Unable to access a secure random source.");
}

function generateRandomBytesNonThrowing(params: GenerateRandomBytesParams & NonThrowing): Result<Uint8Array> {
  try {
    return {
      success: true,
      data: generateRandomBytesThrowing({ ...params, throwOnError: true }),
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e : new Error("Unexpected error."),
    };
  }
}

export function generateRandomBytes(params: GenerateRandomBytesParams & NonThrowing): Result<Uint8Array>;
export function generateRandomBytes(params: GenerateRandomBytesParams & Throwing): Uint8Array;
export function generateRandomBytes(params: GenerateRandomBytesParams): Uint8Array | Result<Uint8Array>;
export function generateRandomBytes(params: GenerateRandomBytesParams) {
  if (params.throwOnError === true) {
    return generateRandomBytesThrowing({ ...params, throwOnError: true });
  } else {
    return generateRandomBytesNonThrowing({ ...params, throwOnError: false });
  }
}
