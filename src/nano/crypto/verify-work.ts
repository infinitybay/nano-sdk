import { blake2bFinal, blake2bInit, blake2bUpdate } from "blakejs";

import { HashString } from "../types/hash";
import { NonThrowing } from "../types/non-throwing";
import { PredicateResult } from "../types/result";
import { Throwing } from "../types/throwing";
import { WorkString } from "../types/work";
import { WorkDifficultyString } from "../types/work-difficulty";
import { hashToBytes } from "./conversion/hash-converter";
import { bytesToHex } from "./conversion/hex-converter";
import { workToBytes } from "./conversion/work-converter";

type VerifyWorkParams = {
  hash: HashString;
  work: WorkString;
  threshold: string;
} & (Throwing | NonThrowing);

function verifyWorkThrowing(params: VerifyWorkParams & Throwing): boolean {
  const hashBytes = hashToBytes({ hash: params.hash, throwOnError: true });
  const workBytes = workToBytes({ work: params.work, throwOnError: true });

  if (!WorkDifficultyString().safeParse(params.threshold).success) {
    throw new Error("Invalid work threshold.");
  }

  try {
    const context = blake2bInit(8);
    blake2bUpdate(context, workBytes.reverse());
    blake2bUpdate(context, hashBytes);
    const outputBytes = blake2bFinal(context).reverse();
    const outputHex = bytesToHex({ bytes: outputBytes, throwOnError: true });
    return BigInt(`0x${outputHex}`) >= BigInt(`0x${params.threshold}`);
  } catch (_err) {
    throw new Error("Failed to verify work.");
  }
}

function verifyWorkNonThrowing(params: VerifyWorkParams & NonThrowing): PredicateResult<"checked", "validWork"> {
  try {
    return {
      checked: true,
      validWork: verifyWorkThrowing({ ...params, throwOnError: true }),
    };
  } catch (e) {
    return {
      checked: false,
      error: e instanceof Error ? e : new Error("Unexpected error."),
    };
  }
}

export function verifyWork(params: VerifyWorkParams & NonThrowing): PredicateResult<"checked", "validWork">;
export function verifyWork(params: VerifyWorkParams & Throwing): boolean;
export function verifyWork(params: VerifyWorkParams): PredicateResult<"checked", "validWork"> | boolean;
export function verifyWork(params: VerifyWorkParams) {
  if (params.throwOnError === true) {
    return verifyWorkThrowing({ ...params, throwOnError: true });
  } else {
    return verifyWorkNonThrowing({ ...params, throwOnError: false });
  }
}
