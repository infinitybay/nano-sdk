import { ByteArray } from "../../types/byte-array";
import { NonThrowing } from "../../types/non-throwing";
import { Result } from "../../types/result";
import { Throwing } from "../../types/throwing";
import { WorkString } from "../../types/work";
import { CryptoError } from "../crypto-error";
import { CryptoErrorCode } from "../crypto-error-code";
import { bytesToHex, hexToBytes } from "./hex-converter";

export type WorkToBytesParams = {
  work: WorkString;
};

export type WorkToBytesResult = Result<
  Uint8Array,
  CryptoError<CryptoErrorCode.HexToBytesFailed | CryptoErrorCode.InvalidWork | CryptoErrorCode.Unexpected>
>;

export function workToBytes(params: WorkToBytesParams & NonThrowing): WorkToBytesResult;
export function workToBytes(params: WorkToBytesParams & Throwing): Uint8Array;
export function workToBytes(params: WorkToBytesParams & (Throwing | NonThrowing)): Uint8Array | WorkToBytesResult;
export function workToBytes(params: WorkToBytesParams & (Throwing | NonThrowing)) {
  const result = ((): WorkToBytesResult => {
    try {
      const validatedWork = WorkString().safeParse(params.work);
      if (!validatedWork.success) {
        return Result.err(new CryptoError(CryptoErrorCode.InvalidWork, "Invalid work value."));
      }

      const bytesResult = hexToBytes({ hex: validatedWork.data, throwOnError: false });
      if (!bytesResult.success) {
        return Result.err(
          new CryptoError(CryptoErrorCode.HexToBytesFailed, "Failed to convert work hex to bytes.", {
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

export type BytesToWorkParams = {
  workBytes: Uint8Array;
};

export type BytesToWorkResult = Result<
  WorkString,
  CryptoError<
    | CryptoErrorCode.BytesToHexFailed
    | CryptoErrorCode.InvalidBytes
    | CryptoErrorCode.InvalidWorkBytes
    | CryptoErrorCode.Unexpected
  >
>;

export function bytesToWork(params: BytesToWorkParams & NonThrowing): BytesToWorkResult;
export function bytesToWork(params: BytesToWorkParams & Throwing): WorkString;
export function bytesToWork(params: BytesToWorkParams & (Throwing | NonThrowing)): WorkString | BytesToWorkResult;
export function bytesToWork(params: BytesToWorkParams & (Throwing | NonThrowing)) {
  const result = ((): BytesToWorkResult => {
    try {
      const bytesResult = ByteArray().safeParse(params.workBytes);
      if (!bytesResult.success) {
        return Result.err(new CryptoError(CryptoErrorCode.InvalidBytes, "Invalid bytes value."));
      }

      const hexResult = bytesToHex({ bytes: bytesResult.data, throwOnError: false });
      if (!hexResult.success) {
        return Result.err(
          new CryptoError(CryptoErrorCode.BytesToHexFailed, "Failed to convert work bytes to hex.", {
            cause: hexResult.error,
          })
        );
      }

      const workResult = WorkString().safeParse(hexResult.data);
      if (!workResult.success) {
        return Result.err(new CryptoError(CryptoErrorCode.InvalidWorkBytes, "Invalid work byte array."));
      }

      return Result.ok(workResult.data);
    } catch (e) {
      return Result.err(new CryptoError(CryptoErrorCode.Unexpected, "Unexpected error.", { cause: e }));
    }
  })();

  return Result.unwrap(result, params.throwOnError);
}
