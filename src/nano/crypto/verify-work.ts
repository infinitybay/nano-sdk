import { blake2bFinal, blake2bInit, blake2bUpdate } from "blakejs";

import { HashString } from "../types/hash";
import { NonThrowing } from "../types/non-throwing";
import { PredicateResult, Result } from "../types/result";
import { Throwing } from "../types/throwing";
import { WorkString } from "../types/work";
import { WorkDifficultyString } from "../types/work-difficulty";
import { hashToBytes } from "./conversion/hash-converter";
import { bytesToHex } from "./conversion/hex-converter";
import { workToBytes } from "./conversion/work-converter";
import { CryptoError } from "./crypto-error";
import { CryptoErrorCode } from "./crypto-error-code";

export type VerifyWorkParams = {
  hash: HashString;
  work: WorkString;
  threshold: string;
};

export type VerifyWorkResult = PredicateResult<
  "checked",
  "validWork",
  CryptoError<
    | CryptoErrorCode.BytesToHexFailed
    | CryptoErrorCode.ComputeWorkDifficultyFailed
    | CryptoErrorCode.HashToBytesFailed
    | CryptoErrorCode.InvalidWorkThreshold
    | CryptoErrorCode.Unexpected
    | CryptoErrorCode.WorkToBytesFailed
  >
>;

export function verifyWork(params: VerifyWorkParams & NonThrowing): VerifyWorkResult;
export function verifyWork(params: VerifyWorkParams & Throwing): boolean;
export function verifyWork(params: VerifyWorkParams & (Throwing | NonThrowing)): VerifyWorkResult | boolean;
export function verifyWork(params: VerifyWorkParams & (Throwing | NonThrowing)) {
  const result = ((): Result<boolean, Extract<VerifyWorkResult, { checked: false }>["error"]> => {
    try {
      const hashBytes = hashToBytes({ hash: params.hash, throwOnError: false });
      if (!hashBytes.success) {
        return Result.err(
          new CryptoError(CryptoErrorCode.HashToBytesFailed, "Failed to convert hash to bytes.", {
            cause: hashBytes.error,
          })
        );
      }

      const workBytes = workToBytes({ work: params.work, throwOnError: false });
      if (!workBytes.success) {
        return Result.err(
          new CryptoError(CryptoErrorCode.WorkToBytesFailed, "Failed to convert work to bytes.", {
            cause: workBytes.error,
          })
        );
      }

      if (!WorkDifficultyString().safeParse(params.threshold).success) {
        return Result.err(new CryptoError(CryptoErrorCode.InvalidWorkThreshold, "Invalid work threshold."));
      }

      let outputBytes: Uint8Array;
      try {
        const context = blake2bInit(8);
        blake2bUpdate(context, workBytes.data.reverse());
        blake2bUpdate(context, hashBytes.data);
        outputBytes = blake2bFinal(context).reverse();
      } catch (err) {
        return Result.err(
          new CryptoError(CryptoErrorCode.ComputeWorkDifficultyFailed, "Failed to compute work difficulty.", {
            cause: err,
          })
        );
      }

      const outputHexResult = bytesToHex({ bytes: outputBytes, throwOnError: false });
      if (!outputHexResult.success) {
        return Result.err(
          new CryptoError(CryptoErrorCode.BytesToHexFailed, "Failed to convert work result to hex.", {
            cause: outputHexResult.error,
          })
        );
      }

      return Result.ok(BigInt(`0x${outputHexResult.data}`) >= BigInt(`0x${params.threshold}`));
    } catch (e) {
      return Result.err(new CryptoError(CryptoErrorCode.Unexpected, "Unexpected error.", { cause: e }));
    }
  })();

  if (params.throwOnError === false) {
    if (result.success) {
      return { checked: true, validWork: result.data };
    }

    return { checked: false, error: result.error };
  }

  return Result.unwrap(result, params.throwOnError);
}
