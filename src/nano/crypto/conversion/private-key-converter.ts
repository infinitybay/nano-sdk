import { NonThrowing } from "../../types/non-throwing";
import { PrivateKeyString } from "../../types/private-key";
import { Result } from "../../types/result";
import { Throwing } from "../../types/throwing";
import { bytesToHex, hexToBytes } from "./hex-converter";

type PrivateKeyToBytesParams = {
  privateKey: PrivateKeyString;
} & (Throwing | NonThrowing);

function privateKeyToBytesThrowing(params: PrivateKeyToBytesParams & Throwing): Uint8Array {
  const validatedPrivateKey = PrivateKeyString().safeParse(params.privateKey);
  if (!validatedPrivateKey.success) {
    throw new Error("Invalid private key value.");
  }

  return hexToBytes({ hex: validatedPrivateKey.data, throwOnError: true });
}

function privateKeyToBytesNonThrowing(params: PrivateKeyToBytesParams & NonThrowing): Result<Uint8Array> {
  try {
    return {
      success: true,
      data: privateKeyToBytesThrowing({ ...params, throwOnError: true }),
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e : new Error("Unexpected error."),
    };
  }
}

export function privateKeyToBytes(params: PrivateKeyToBytesParams & NonThrowing): Result<Uint8Array>;
export function privateKeyToBytes(params: PrivateKeyToBytesParams & Throwing): Uint8Array;
export function privateKeyToBytes(params: PrivateKeyToBytesParams): Uint8Array | Result<Uint8Array>;
export function privateKeyToBytes(params: PrivateKeyToBytesParams) {
  if (params.throwOnError === false) {
    return privateKeyToBytesNonThrowing({ ...params, throwOnError: false });
  } else {
    return privateKeyToBytesThrowing({ ...params, throwOnError: true });
  }
}

type BytesToPrivateKeyParams = {
  privateKeyBytes: Uint8Array;
} & (Throwing | NonThrowing);

function bytesToPrivateKeyThrowing(params: BytesToPrivateKeyParams & Throwing): PrivateKeyString {
  const hexResult = bytesToHex({ bytes: params.privateKeyBytes, throwOnError: true });
  const privateKeyResult = PrivateKeyString().safeParse(hexResult);
  if (!privateKeyResult.success) {
    throw new Error("Invalid private key byte array.");
  }

  return privateKeyResult.data;
}

function bytesToPrivateKeyNonThrowing(params: BytesToPrivateKeyParams & NonThrowing): Result<PrivateKeyString> {
  try {
    return {
      success: true,
      data: bytesToPrivateKeyThrowing({ ...params, throwOnError: true }),
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e : new Error("Unexpected error."),
    };
  }
}

export function bytesToPrivateKey(params: BytesToPrivateKeyParams & NonThrowing): Result<PrivateKeyString>;
export function bytesToPrivateKey(params: BytesToPrivateKeyParams & Throwing): PrivateKeyString;
export function bytesToPrivateKey(params: BytesToPrivateKeyParams): PrivateKeyString | Result<PrivateKeyString>;
export function bytesToPrivateKey(params: BytesToPrivateKeyParams) {
  if (params.throwOnError === false) {
    return bytesToPrivateKeyNonThrowing({ ...params, throwOnError: false });
  } else {
    return bytesToPrivateKeyThrowing({ ...params, throwOnError: true });
  }
}
