import { blake2bFinal, blake2bInit, blake2bUpdate } from "blakejs";

import { Amount } from "../types/amount";
import { HashString } from "../types/hash";
import { Result } from "../types/result";
import { WorkString } from "../types/work";
import { WorkDifficultyString } from "../types/work-difficulty";
import { hashToBytes } from "./conversion/hash-converter";
import { bytesToHex } from "./conversion/hex-converter";
import { workToBytes } from "./conversion/work-converter";

type VerifyWorkInput = {
  hash: HashString;
  work: WorkString;
  threshold: string;
};

export function verifyWork(input: VerifyWorkInput): boolean {
  const hashBytes = hashToBytes(input.hash);
  const workBytes = workToBytes(input.work);

  if (!WorkDifficultyString().safeParse(input.threshold).success) {
    throw new Error("Invalid work threshold.");
  }

  const thresholdResult = Amount.safeParse(`0x${input.threshold}`);
  if (!thresholdResult.success) {
    throw new Error("Invalid work threshold.");
  }

  try {
    const context = blake2bInit(8);
    blake2bUpdate(context, workBytes.reverse());
    blake2bUpdate(context, hashBytes);
    const output = blake2bFinal(context).reverse();

    const outputHex = bytesToHex(output);
    const outputAmountResult = Amount.safeParse(`0x${outputHex}`);
    if (!outputAmountResult.success) {
      throw new Error("Failed to parse work value.");
    }

    return outputAmountResult.data.isGreaterThanOrEqualTo(thresholdResult.data);
  } catch (_err) {
    throw new Error("Failed to verify work.");
  }
}

export function safeVerifyWork(input: VerifyWorkInput): Result<boolean> {
  try {
    return { success: true, data: verifyWork(input) };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err : new Error("Unexpected error.") };
  }
}
