import { NonThrowing } from "../../types/non-throwing";
import { Result } from "../../types/result";
import { SignatureString } from "../../types/signature";
import { Throwing } from "../../types/throwing";
import { bytesToHex, hexToBytes } from "./hex-converter";

type SignatureToBytesParams = {
  signature: SignatureString;
} & (Throwing | NonThrowing);

function signatureToBytesThrowing(params: SignatureToBytesParams & Throwing): Uint8Array {
  const validatedSignature = SignatureString().safeParse(params.signature);
  if (!validatedSignature.success) {
    throw new Error("Invalid signature value.");
  }

  return hexToBytes({ hex: validatedSignature.data, throwOnError: true });
}

function signatureToBytesNonThrowing(params: SignatureToBytesParams & NonThrowing): Result<Uint8Array> {
  try {
    return {
      success: true,
      data: signatureToBytesThrowing({ ...params, throwOnError: true }),
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e : new Error("Unexpected error."),
    };
  }
}

export function signatureToBytes(params: SignatureToBytesParams & NonThrowing): Result<Uint8Array>;
export function signatureToBytes(params: SignatureToBytesParams & Throwing): Uint8Array;
export function signatureToBytes(params: SignatureToBytesParams): Uint8Array | Result<Uint8Array>;
export function signatureToBytes(params: SignatureToBytesParams) {
  if (params.throwOnError === false) {
    return signatureToBytesNonThrowing({ ...params, throwOnError: false });
  } else {
    return signatureToBytesThrowing({ ...params, throwOnError: true });
  }
}

type BytesToSignatureParams = {
  signatureBytes: Uint8Array;
} & (Throwing | NonThrowing);

function bytesToSignatureThrowing(params: BytesToSignatureParams & Throwing): SignatureString {
  const hexResult = bytesToHex({ bytes: params.signatureBytes, throwOnError: true });
  const signatureResult = SignatureString().safeParse(hexResult);
  if (!signatureResult.success) {
    throw new Error("Invalid signature byte array.");
  }

  return signatureResult.data;
}

function bytesToSignatureNonThrowing(params: BytesToSignatureParams & NonThrowing): Result<SignatureString> {
  try {
    return {
      success: true,
      data: bytesToSignatureThrowing({ ...params, throwOnError: true }),
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e : new Error("Unexpected error."),
    };
  }
}

export function bytesToSignature(params: BytesToSignatureParams & NonThrowing): Result<SignatureString>;
export function bytesToSignature(params: BytesToSignatureParams & Throwing): SignatureString;
export function bytesToSignature(params: BytesToSignatureParams): SignatureString | Result<SignatureString>;
export function bytesToSignature(params: BytesToSignatureParams) {
  if (params.throwOnError === false) {
    return bytesToSignatureNonThrowing({ ...params, throwOnError: false });
  } else {
    return bytesToSignatureThrowing({ ...params, throwOnError: true });
  }
}
