import { ByteArray } from "../../types/byte-array";
import { HashString } from "../../types/hash";
import { NonThrowing } from "../../types/non-throwing";
import { Result } from "../../types/result";
import { Throwing } from "../../types/throwing";
import { CryptoError } from "../crypto-error";
import { CryptoErrorCode } from "../crypto-error-code";
import { bytesToHex, hexToBytes } from "./hex-converter";

export type HashToBytesParams = {
  hash: HashString;
};

export type HashToBytesResult = Result<
  Uint8Array,
  CryptoError<CryptoErrorCode.HexToBytesFailed | CryptoErrorCode.InvalidHash | CryptoErrorCode.Unexpected>
>;

export function hashToBytes(params: HashToBytesParams & NonThrowing): HashToBytesResult;
export function hashToBytes(params: HashToBytesParams & Throwing): Uint8Array;
export function hashToBytes(params: HashToBytesParams & (Throwing | NonThrowing)): Uint8Array | HashToBytesResult;
export function hashToBytes(params: HashToBytesParams & (Throwing | NonThrowing)) {
  const result = ((): HashToBytesResult => {
    try {
      const validatedHash = HashString().safeParse(params.hash);
      if (!validatedHash.success) {
        return Result.err(new CryptoError(CryptoErrorCode.InvalidHash, "Invalid hash value."));
      }

      const bytesResult = hexToBytes({ hex: validatedHash.data, throwOnError: false });
      if (!bytesResult.success) {
        return Result.err(
          new CryptoError(CryptoErrorCode.HexToBytesFailed, "Failed to convert hash hex to bytes.", {
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

export type BytesToHashParams = {
  hashBytes: Uint8Array;
};

export type BytesToHashResult = Result<
  HashString,
  CryptoError<
    | CryptoErrorCode.BytesToHexFailed
    | CryptoErrorCode.InvalidBytes
    | CryptoErrorCode.InvalidHashBytes
    | CryptoErrorCode.Unexpected
  >
>;

export function bytesToHash(params: BytesToHashParams & NonThrowing): BytesToHashResult;
export function bytesToHash(params: BytesToHashParams & Throwing): HashString;
export function bytesToHash(params: BytesToHashParams & (Throwing | NonThrowing)): HashString | BytesToHashResult;
export function bytesToHash(params: BytesToHashParams & (Throwing | NonThrowing)) {
  const result = ((): BytesToHashResult => {
    try {
      const bytesResult = ByteArray().safeParse(params.hashBytes);
      if (!bytesResult.success) {
        return Result.err(new CryptoError(CryptoErrorCode.InvalidBytes, "Invalid bytes value."));
      }

      const hexResult = bytesToHex({ bytes: bytesResult.data, throwOnError: false });
      if (!hexResult.success) {
        return Result.err(
          new CryptoError(CryptoErrorCode.BytesToHexFailed, "Failed to convert hash bytes to hex.", {
            cause: hexResult.error,
          })
        );
      }

      const validatedHash = HashString().safeParse(hexResult.data);
      if (!validatedHash.success) {
        return Result.err(new CryptoError(CryptoErrorCode.InvalidHashBytes, "Invalid hash byte array."));
      }

      return Result.ok(validatedHash.data);
    } catch (e) {
      return Result.err(new CryptoError(CryptoErrorCode.Unexpected, "Unexpected error.", { cause: e }));
    }
  })();

  return Result.unwrap(result, params.throwOnError);
}
