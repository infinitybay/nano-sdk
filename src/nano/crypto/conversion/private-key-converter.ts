import { ByteArray } from "../../types/byte-array";
import { NonThrowing } from "../../types/non-throwing";
import { PrivateKeyString } from "../../types/private-key";
import { Result } from "../../types/result";
import { Throwing } from "../../types/throwing";
import { CryptoError } from "../crypto-error";
import { CryptoErrorCode } from "../crypto-error-code";
import { bytesToHex, hexToBytes } from "./hex-converter";

export type PrivateKeyToBytesParams = {
  privateKey: PrivateKeyString;
};

export type PrivateKeyToBytesResult = Result<
  Uint8Array,
  CryptoError<CryptoErrorCode.HexToBytesFailed | CryptoErrorCode.InvalidPrivateKey | CryptoErrorCode.Unexpected>
>;

export function privateKeyToBytes(params: PrivateKeyToBytesParams & NonThrowing): PrivateKeyToBytesResult;
export function privateKeyToBytes(params: PrivateKeyToBytesParams & Throwing): Uint8Array;
export function privateKeyToBytes(
  params: PrivateKeyToBytesParams & (Throwing | NonThrowing)
): Uint8Array | PrivateKeyToBytesResult;
export function privateKeyToBytes(params: PrivateKeyToBytesParams & (Throwing | NonThrowing)) {
  const result = ((): PrivateKeyToBytesResult => {
    try {
      const validatedPrivateKey = PrivateKeyString().safeParse(params.privateKey);
      if (!validatedPrivateKey.success) {
        return Result.err(new CryptoError(CryptoErrorCode.InvalidPrivateKey, "Invalid private key value."));
      }

      const bytesResult = hexToBytes({ hex: validatedPrivateKey.data, throwOnError: false });
      if (!bytesResult.success) {
        return Result.err(
          new CryptoError(CryptoErrorCode.HexToBytesFailed, "Failed to convert private key hex to bytes.", {
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

export type BytesToPrivateKeyParams = {
  privateKeyBytes: Uint8Array;
};

export type BytesToPrivateKeyResult = Result<
  PrivateKeyString,
  CryptoError<
    | CryptoErrorCode.BytesToHexFailed
    | CryptoErrorCode.InvalidBytes
    | CryptoErrorCode.InvalidPrivateKeyBytes
    | CryptoErrorCode.Unexpected
  >
>;

export function bytesToPrivateKey(params: BytesToPrivateKeyParams & NonThrowing): BytesToPrivateKeyResult;
export function bytesToPrivateKey(params: BytesToPrivateKeyParams & Throwing): PrivateKeyString;
export function bytesToPrivateKey(
  params: BytesToPrivateKeyParams & (Throwing | NonThrowing)
): PrivateKeyString | BytesToPrivateKeyResult;
export function bytesToPrivateKey(params: BytesToPrivateKeyParams & (Throwing | NonThrowing)) {
  const result = ((): BytesToPrivateKeyResult => {
    try {
      const bytesResult = ByteArray().safeParse(params.privateKeyBytes);
      if (!bytesResult.success) {
        return Result.err(new CryptoError(CryptoErrorCode.InvalidBytes, "Invalid bytes value."));
      }

      const hexResult = bytesToHex({ bytes: bytesResult.data, throwOnError: false });
      if (!hexResult.success) {
        return Result.err(
          new CryptoError(CryptoErrorCode.BytesToHexFailed, "Failed to convert private key bytes to hex.", {
            cause: hexResult.error,
          })
        );
      }

      const privateKeyResult = PrivateKeyString().safeParse(hexResult.data);
      if (!privateKeyResult.success) {
        return Result.err(new CryptoError(CryptoErrorCode.InvalidPrivateKeyBytes, "Invalid private key byte array."));
      }

      return Result.ok(privateKeyResult.data);
    } catch (e) {
      return Result.err(new CryptoError(CryptoErrorCode.Unexpected, "Unexpected error.", { cause: e }));
    }
  })();

  return Result.unwrap(result, params.throwOnError);
}
