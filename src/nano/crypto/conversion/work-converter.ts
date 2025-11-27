import { Result } from "../../types/result";
import { WorkString } from "../../types/work";
import { bytesToHex, hexToBytes } from "./hex-converter";

export function workToBytes(work: WorkString): Uint8Array {
  const validatedWork = WorkString().safeParse(work);
  if (!validatedWork.success) {
    throw new Error("Invalid work value.");
  }

  return hexToBytes(validatedWork.data);
}

export function safeWorkToBytes(work: WorkString): Result<Uint8Array> {
  try {
    return { success: true, data: workToBytes(work) };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err : new Error("Unexpected error.") };
  }
}

export function bytesToWork(workBytes: Uint8Array): WorkString {
  const hexResult = bytesToHex(workBytes);
  const workResult = WorkString().safeParse(hexResult);
  if (!workResult.success) {
    throw new Error("Invalid work byte array.");
  }

  return workResult.data;
}

export function safeBytesToWork(workBytes: Uint8Array): Result<WorkString> {
  try {
    return { success: true, data: bytesToWork(workBytes) };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err : new Error("Unexpected error.") };
  }
}
