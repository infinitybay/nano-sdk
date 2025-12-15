import { HashString } from "../../types/hash";
import { NonThrowing } from "../../types/non-throwing";
import { Result } from "../../types/result";
import { Throwing } from "../../types/throwing";
import { bytesToHex, hexToBytes } from "./hex-converter";

type HashToBytesParams = {
  hash: HashString;
} & (Throwing | NonThrowing);

function hashToBytesThrowing(params: HashToBytesParams & Throwing): Uint8Array {
  const validatedHash = HashString().safeParse(params.hash);
  if (!validatedHash.success) {
    throw new Error("Invalid hash value.");
  }

  return hexToBytes({ hex: validatedHash.data, throwOnError: true });
}

function hashToBytesNonThrowing(params: HashToBytesParams & NonThrowing): Result<Uint8Array> {
  try {
    return {
      success: true,
      data: hashToBytesThrowing({ ...params, throwOnError: true }),
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e : new Error("Unexpected error."),
    };
  }
}

export function hashToBytes(params: HashToBytesParams & NonThrowing): Result<Uint8Array>;
export function hashToBytes(params: HashToBytesParams & Throwing): Uint8Array;
export function hashToBytes(params: HashToBytesParams): Uint8Array | Result<Uint8Array>;
export function hashToBytes(params: HashToBytesParams) {
  if (params.throwOnError === false) {
    return hashToBytesNonThrowing({ ...params, throwOnError: false });
  } else {
    return hashToBytesThrowing({ ...params, throwOnError: true });
  }
}

type BytesToHashParams = {
  hashBytes: Uint8Array;
} & (Throwing | NonThrowing);

function bytesToHashThrowing(params: BytesToHashParams & Throwing): HashString {
  const hexResult = bytesToHex({ bytes: params.hashBytes, throwOnError: true });
  const validatedHash = HashString().safeParse(hexResult);
  if (!validatedHash.success) {
    throw new Error("Invalid hash byte array.");
  }

  return validatedHash.data;
}

function bytesToHashNonThrowing(params: BytesToHashParams & NonThrowing): Result<HashString> {
  try {
    return {
      success: true,
      data: bytesToHashThrowing({ ...params, throwOnError: true }),
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e : new Error("Unexpected error."),
    };
  }
}

export function bytesToHash(params: BytesToHashParams & NonThrowing): Result<HashString>;
export function bytesToHash(params: BytesToHashParams & Throwing): HashString;
export function bytesToHash(params: BytesToHashParams): HashString | Result<HashString>;
export function bytesToHash(params: BytesToHashParams) {
  if (params.throwOnError === false) {
    return bytesToHashNonThrowing({ ...params, throwOnError: false });
  } else {
    return bytesToHashThrowing({ ...params, throwOnError: true });
  }
}
