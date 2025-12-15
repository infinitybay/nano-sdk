import { NonThrowing } from "../../types/non-throwing";
import { PublicKeyString } from "../../types/public-key";
import { Result } from "../../types/result";
import { Throwing } from "../../types/throwing";
import { bytesToHex, hexToBytes } from "./hex-converter";

type PublicKeyToBytesParams = {
  publicKey: PublicKeyString;
} & (Throwing | NonThrowing);

function publicKeyToBytesThrowing(params: PublicKeyToBytesParams & Throwing): Uint8Array {
  const validatedPublicKey = PublicKeyString().safeParse(params.publicKey);
  if (!validatedPublicKey.success) {
    throw new Error("Invalid public key value.");
  }

  return hexToBytes({ hex: validatedPublicKey.data, throwOnError: true });
}

function publicKeyToBytesNonThrowing(params: PublicKeyToBytesParams & NonThrowing): Result<Uint8Array> {
  try {
    return {
      success: true,
      data: publicKeyToBytesThrowing({ ...params, throwOnError: true }),
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e : new Error("Unexpected error."),
    };
  }
}

export function publicKeyToBytes(params: PublicKeyToBytesParams & NonThrowing): Result<Uint8Array>;
export function publicKeyToBytes(params: PublicKeyToBytesParams & Throwing): Uint8Array;
export function publicKeyToBytes(params: PublicKeyToBytesParams): Uint8Array | Result<Uint8Array>;
export function publicKeyToBytes(params: PublicKeyToBytesParams) {
  if (params.throwOnError === false) {
    return publicKeyToBytesNonThrowing({ ...params, throwOnError: false });
  } else {
    return publicKeyToBytesThrowing({ ...params, throwOnError: true });
  }
}

type BytesToPublicKeyParams = {
  publicKeyBytes: Uint8Array;
} & (Throwing | NonThrowing);

function bytesToPublicKeyThrowing(params: BytesToPublicKeyParams & Throwing): PublicKeyString {
  const hexResult = bytesToHex({ bytes: params.publicKeyBytes, throwOnError: true });
  const publicKeyResult = PublicKeyString().safeParse(hexResult);
  if (!publicKeyResult.success) {
    throw new Error("Invalid public key byte array.");
  }

  return publicKeyResult.data;
}

function bytesToPublicKeyNonThrowing(params: BytesToPublicKeyParams & NonThrowing): Result<PublicKeyString> {
  try {
    return {
      success: true,
      data: bytesToPublicKeyThrowing({ ...params, throwOnError: true }),
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e : new Error("Unexpected error."),
    };
  }
}

export function bytesToPublicKey(params: BytesToPublicKeyParams & NonThrowing): Result<PublicKeyString>;
export function bytesToPublicKey(params: BytesToPublicKeyParams & Throwing): PublicKeyString;
export function bytesToPublicKey(params: BytesToPublicKeyParams): PublicKeyString | Result<PublicKeyString>;
export function bytesToPublicKey(params: BytesToPublicKeyParams) {
  if (params.throwOnError === false) {
    return bytesToPublicKeyNonThrowing({ ...params, throwOnError: false });
  } else {
    return bytesToPublicKeyThrowing({ ...params, throwOnError: true });
  }
}
