import { NonThrowing } from "../../types/non-throwing";
import { Result } from "../../types/result";
import { Throwing } from "../../types/throwing";
import { WorkString } from "../../types/work";
import { bytesToHex, hexToBytes } from "./hex-converter";

type WorkToBytesParams = {
  work: WorkString;
} & (Throwing | NonThrowing);

function workToBytesThrowing(params: WorkToBytesParams & Throwing): Uint8Array {
  const validatedWork = WorkString().safeParse(params.work);
  if (!validatedWork.success) {
    throw new Error("Invalid work value.");
  }

  return hexToBytes({ hex: validatedWork.data, throwOnError: true });
}

function workToBytesNonThrowing(params: WorkToBytesParams & NonThrowing): Result<Uint8Array> {
  try {
    return {
      success: true,
      data: workToBytesThrowing({ ...params, throwOnError: true }),
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e : new Error("Unexpected error."),
    };
  }
}

export function workToBytes(params: WorkToBytesParams & NonThrowing): Result<Uint8Array>;
export function workToBytes(params: WorkToBytesParams & Throwing): Uint8Array;
export function workToBytes(params: WorkToBytesParams): Uint8Array | Result<Uint8Array>;
export function workToBytes(params: WorkToBytesParams) {
  if (params.throwOnError === true) {
    return workToBytesThrowing({ ...params, throwOnError: true });
  } else {
    return workToBytesNonThrowing({ ...params, throwOnError: false });
  }
}

type BytesToWorkParams = {
  workBytes: Uint8Array;
} & (Throwing | NonThrowing);

function bytesToWorkThrowing(params: BytesToWorkParams & Throwing): WorkString {
  const hexResult = bytesToHex({ bytes: params.workBytes, throwOnError: true });
  const workResult = WorkString().safeParse(hexResult);
  if (!workResult.success) {
    throw new Error("Invalid work byte array.");
  }

  return workResult.data;
}

function bytesToWorkNonThrowing(params: BytesToWorkParams & NonThrowing): Result<WorkString> {
  try {
    return {
      success: true,
      data: bytesToWorkThrowing({ ...params, throwOnError: true }),
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e : new Error("Unexpected error."),
    };
  }
}

export function bytesToWork(params: BytesToWorkParams & NonThrowing): Result<WorkString>;
export function bytesToWork(params: BytesToWorkParams & Throwing): WorkString;
export function bytesToWork(params: BytesToWorkParams): WorkString | Result<WorkString>;
export function bytesToWork(params: BytesToWorkParams) {
  if (params.throwOnError === true) {
    return bytesToWorkThrowing({ ...params, throwOnError: true });
  } else {
    return bytesToWorkNonThrowing({ ...params, throwOnError: false });
  }
}
