import { ByteArray } from "../../types/byte-array";
import { NonThrowing } from "../../types/non-throwing";
import { Result } from "../../types/result";
import { SeedString } from "../../types/seed";
import { Throwing } from "../../types/throwing";
import { CryptoError } from "../crypto-error";
import { CryptoErrorCode } from "../crypto-error-code";
import { bytesToHex, hexToBytes } from "./hex-converter";

export type SeedToBytesParams = {
  seed: SeedString;
};

export type SeedToBytesResult = Result<
  Uint8Array,
  CryptoError<CryptoErrorCode.HexToBytesFailed | CryptoErrorCode.InvalidSeed | CryptoErrorCode.Unexpected>
>;

export function seedToBytes(params: SeedToBytesParams & NonThrowing): SeedToBytesResult;
export function seedToBytes(params: SeedToBytesParams & Throwing): Uint8Array;
export function seedToBytes(params: SeedToBytesParams & (Throwing | NonThrowing)): Uint8Array | SeedToBytesResult;
export function seedToBytes(params: SeedToBytesParams & (Throwing | NonThrowing)) {
  const result = ((): SeedToBytesResult => {
    try {
      const validatedSeed = SeedString().safeParse(params.seed);
      if (!validatedSeed.success) {
        return Result.err(new CryptoError(CryptoErrorCode.InvalidSeed, "Invalid seed value."));
      }

      const bytesResult = hexToBytes({ hex: validatedSeed.data, throwOnError: false });
      if (!bytesResult.success) {
        return Result.err(
          new CryptoError(CryptoErrorCode.HexToBytesFailed, "Failed to convert seed hex to bytes.", {
            cause: bytesResult.error,
          })
        );
      }

      return Result.ok(bytesResult.data);
    } catch (e) {
      return Result.err(new CryptoError(CryptoErrorCode.Unexpected, "Unexpected error.", { cause: e }));
    }
  })();

  return Result.unwrap(result, params.throwOnError);
}

export type BytesToSeedParams = {
  seedBytes: Uint8Array;
};

export type BytesToSeedResult = Result<
  SeedString,
  CryptoError<
    | CryptoErrorCode.BytesToHexFailed
    | CryptoErrorCode.InvalidBytes
    | CryptoErrorCode.InvalidSeedBytes
    | CryptoErrorCode.Unexpected
  >
>;

export function bytesToSeed(params: BytesToSeedParams & NonThrowing): BytesToSeedResult;
export function bytesToSeed(params: BytesToSeedParams & Throwing): SeedString;
export function bytesToSeed(params: BytesToSeedParams & (Throwing | NonThrowing)): SeedString | BytesToSeedResult;
export function bytesToSeed(params: BytesToSeedParams & (Throwing | NonThrowing)) {
  const result = ((): BytesToSeedResult => {
    try {
      const bytesResult = ByteArray().safeParse(params.seedBytes);
      if (!bytesResult.success) {
        return Result.err(new CryptoError(CryptoErrorCode.InvalidBytes, "Invalid bytes value."));
      }

      const hexResult = bytesToHex({ bytes: bytesResult.data, throwOnError: false });
      if (!hexResult.success) {
        return Result.err(
          new CryptoError(CryptoErrorCode.BytesToHexFailed, "Failed to convert seed bytes to hex.", {
            cause: hexResult.error,
          })
        );
      }

      const seedResult = SeedString().safeParse(hexResult.data);
      if (!seedResult.success) {
        return Result.err(new CryptoError(CryptoErrorCode.InvalidSeedBytes, "Invalid seed byte array."));
      }

      return Result.ok(seedResult.data);
    } catch (e) {
      return Result.err(new CryptoError(CryptoErrorCode.Unexpected, "Unexpected error.", { cause: e }));
    }
  })();

  return Result.unwrap(result, params.throwOnError);
}
