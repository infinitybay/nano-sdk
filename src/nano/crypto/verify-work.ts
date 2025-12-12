import { blake2bFinal, blake2bInit, blake2bUpdate } from "blakejs";

import { Amount } from "../types/amount";
import { HashString } from "../types/hash";
import { NonThrowing } from "../types/non-throwing";
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

  const thresholdResult = Amount.safeParse(`0x${params.threshold}`);
  if (!thresholdResult.success) {
    throw new Error("Invalid work threshold.");
  }

  try {
    const context = blake2bInit(8);
    blake2bUpdate(context, workBytes.reverse());
    blake2bUpdate(context, hashBytes);
    const output = blake2bFinal(context).reverse();

    const outputHex = bytesToHex({ bytes: output, throwOnError: true });
    const outputAmountResult = Amount.safeParse(`0x${outputHex}`);
    if (!outputAmountResult.success) {
      throw new Error("Failed to parse work value.");
    }

    return outputAmountResult.data.isGreaterThanOrEqualTo(thresholdResult.data);
  } catch (_err) {
    throw new Error("Failed to verify work.");
  }
}

function verifyWorkNonThrowing(params: VerifyWorkParams & NonThrowing): boolean {
  try {
    return verifyWorkThrowing({ ...params, throwOnError: true });
  } catch (_e) {
    return false;
  }
}

export function verifyWork(params: VerifyWorkParams & NonThrowing): boolean;
export function verifyWork(params: VerifyWorkParams & Throwing): boolean;
export function verifyWork(params: VerifyWorkParams): boolean;
export function verifyWork(params: VerifyWorkParams) {
  if (params.throwOnError === true) {
    return verifyWorkThrowing({ ...params, throwOnError: true });
  } else {
    return verifyWorkNonThrowing({ ...params, throwOnError: false });
  }
}
