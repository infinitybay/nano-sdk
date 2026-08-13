import { ByteArray } from "../../types/byte-array";
import { NonThrowing } from "../../types/non-throwing";
import { PublicKeyString } from "../../types/public-key";
import { Result } from "../../types/result";
import { Throwing } from "../../types/throwing";
import { CryptoError } from "../crypto-error";
import { CryptoErrorCode } from "../crypto-error-code";
import { bytesToHex, hexToBytes } from "./hex-converter";

export type PublicKeyToBytesParams = {
  publicKey: PublicKeyString;
};

export type PublicKeyToBytesResult = Result<
  Uint8Array,
  CryptoError<CryptoErrorCode.HexToBytesFailed | CryptoErrorCode.InvalidPublicKey | CryptoErrorCode.Unexpected>
>;

export function publicKeyToBytes(params: PublicKeyToBytesParams & NonThrowing): PublicKeyToBytesResult;
export function publicKeyToBytes(params: PublicKeyToBytesParams & Throwing): Uint8Array;
export function publicKeyToBytes(
  params: PublicKeyToBytesParams & (Throwing | NonThrowing)
): Uint8Array | PublicKeyToBytesResult;
export function publicKeyToBytes(params: PublicKeyToBytesParams & (Throwing | NonThrowing)) {
  const result = ((): PublicKeyToBytesResult => {
    try {
      const validatedPublicKey = PublicKeyString().safeParse(params.publicKey);
      if (!validatedPublicKey.success) {
        return Result.err(new CryptoError(CryptoErrorCode.InvalidPublicKey, "Invalid public key value."));
      }

      const bytesResult = hexToBytes({ hex: validatedPublicKey.data, throwOnError: false });
      if (!bytesResult.success) {
        return Result.err(
          new CryptoError(CryptoErrorCode.HexToBytesFailed, "Failed to convert public key hex to bytes.", {
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

export type BytesToPublicKeyParams = {
  publicKeyBytes: Uint8Array;
};

export type BytesToPublicKeyResult = Result<
  PublicKeyString,
  CryptoError<
    | CryptoErrorCode.BytesToHexFailed
    | CryptoErrorCode.InvalidBytes
    | CryptoErrorCode.InvalidPublicKeyBytes
    | CryptoErrorCode.Unexpected
  >
>;

export function bytesToPublicKey(params: BytesToPublicKeyParams & NonThrowing): BytesToPublicKeyResult;
export function bytesToPublicKey(params: BytesToPublicKeyParams & Throwing): PublicKeyString;
export function bytesToPublicKey(
  params: BytesToPublicKeyParams & (Throwing | NonThrowing)
): PublicKeyString | BytesToPublicKeyResult;
export function bytesToPublicKey(params: BytesToPublicKeyParams & (Throwing | NonThrowing)) {
  const result = ((): BytesToPublicKeyResult => {
    try {
      const bytesResult = ByteArray().safeParse(params.publicKeyBytes);
      if (!bytesResult.success) {
        return Result.err(new CryptoError(CryptoErrorCode.InvalidBytes, "Invalid bytes value."));
      }

      const hexResult = bytesToHex({ bytes: bytesResult.data, throwOnError: false });
      if (!hexResult.success) {
        return Result.err(
          new CryptoError(CryptoErrorCode.BytesToHexFailed, "Failed to convert public key bytes to hex.", {
            cause: hexResult.error,
          })
        );
      }

      const publicKeyResult = PublicKeyString().safeParse(hexResult.data);
      if (!publicKeyResult.success) {
        return Result.err(new CryptoError(CryptoErrorCode.InvalidPublicKeyBytes, "Invalid public key byte array."));
      }

      return Result.ok(publicKeyResult.data);
    } catch (e) {
      return Result.err(new CryptoError(CryptoErrorCode.Unexpected, "Unexpected error.", { cause: e }));
    }
  })();

  return Result.unwrap(result, params.throwOnError);
}
