import { NonThrowing } from "../types/non-throwing";
import { Result } from "../types/result";
import { Throwing } from "../types/throwing";
import { CryptoError } from "./crypto-error";
import { CryptoErrorCode } from "./crypto-error-code";

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

export type GenerateRandomBytesParams = {
  count: number;
};

export type GenerateRandomBytesResult = Result<
  Uint8Array,
  CryptoError<
    CryptoErrorCode.InvalidRandomByteCount | CryptoErrorCode.RandomSourceUnavailable | CryptoErrorCode.Unexpected
  >
>;

export function generateRandomBytes(params: GenerateRandomBytesParams & NonThrowing): GenerateRandomBytesResult;
export function generateRandomBytes(params: GenerateRandomBytesParams & Throwing): Uint8Array;
export function generateRandomBytes(
  params: GenerateRandomBytesParams & (Throwing | NonThrowing)
): Uint8Array | GenerateRandomBytesResult;
export function generateRandomBytes(params: GenerateRandomBytesParams & (Throwing | NonThrowing)) {
  const result = ((): GenerateRandomBytesResult => {
    try {
      if (!Number.isInteger(params.count) || params.count <= 0) {
        return Result.err(new CryptoError(CryptoErrorCode.InvalidRandomByteCount, "count must be a positive integer"));
      }

      const byteArray = new Uint8Array(params.count);

      try {
        const globalCrypto = (globalThis as { crypto?: WebCrypto }).crypto;
        if (globalCrypto && typeof globalCrypto.getRandomValues === "function") {
          globalCrypto.getRandomValues(byteArray);
          return Result.ok(byteArray);
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
            return Result.ok(byteArray);
          }

          if (nodeCrypto?.randomBytes) {
            byteArray.set(nodeCrypto.randomBytes(byteArray.length));
            return Result.ok(byteArray);
          }
        }
      } catch (_) {
        // Do nothing
      }

      return Result.err(
        new CryptoError(CryptoErrorCode.RandomSourceUnavailable, "Unable to access a secure random source.")
      );
    } catch (e) {
      return Result.err(new CryptoError(CryptoErrorCode.Unexpected, "Unexpected error.", { cause: e }));
    }
  })();

  return Result.unwrap(result, params.throwOnError);
}
