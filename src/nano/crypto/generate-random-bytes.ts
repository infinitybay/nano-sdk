import { NonThrowing } from "../types/non-throwing";
import { Result } from "../types/result";
import { Throwing } from "../types/throwing";

type WebCrypto = {
  getRandomValues?<T extends ArrayBufferView>(array: T): T;
};

type NodeRequireFn = (id: string) => unknown;

function getNodeRequire(): NodeRequireFn | undefined {
  const g = globalThis as typeof globalThis & {
    require?: NodeRequireFn;
  };

  if (typeof g.require === "function") {
    return g.require;
  }

  try {
    return Function("return typeof require !== 'undefined' && require")() as NodeRequireFn | undefined;
  } catch {
    return undefined;
  }
}

type NodeCryptoLike = {
  randomFillSync?: (buffer: Uint8Array) => Uint8Array;
  randomBytes?: (size: number) => Uint8Array;
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
    const nodeRequire = getNodeRequire();
    if (nodeRequire) {
      const nodeCrypto = nodeRequire("crypto") as NodeCryptoLike | undefined;

      if (nodeCrypto?.randomFillSync) {
        nodeCrypto.randomFillSync(byteArray);
        return byteArray;
      }

      if (nodeCrypto?.randomBytes) {
        byteArray.set(nodeCrypto.randomBytes(byteArray.length));
        return byteArray;
      }
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
  if (params.throwOnError === false) {
    return generateRandomBytesNonThrowing({ ...params, throwOnError: false });
  } else {
    return generateRandomBytesThrowing({ ...params, throwOnError: true });
  }
}
