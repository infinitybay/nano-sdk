import { Result } from "../../types/result";
import { SignatureString } from "../../types/signature";
import { bytesToHex, hexToBytes } from "./hex-converter";

export function signatureToBytes(signature: SignatureString): Uint8Array {
  const validatedSignature = SignatureString().safeParse(signature);
  if (!validatedSignature.success) {
    throw new Error("Invalid signature value.");
  }

  return hexToBytes(validatedSignature.data);
}

export function safeSignatureToBytes(signature: SignatureString): Result<Uint8Array> {
  try {
    return { success: true, data: signatureToBytes(signature) };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err : new Error("Unexpected error.") };
  }
}

export function bytesToSignature(signatureBytes: Uint8Array): SignatureString {
  const hexResult = bytesToHex(signatureBytes);
  const signatureResult = SignatureString().safeParse(hexResult);
  if (!signatureResult.success) {
    throw new Error("Invalid signature byte array.");
  }

  return signatureResult.data;
}

export function safeBytesToSignature(signatureBytes: Uint8Array): Result<SignatureString> {
  try {
    return { success: true, data: bytesToSignature(signatureBytes) };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err : new Error("Unexpected error.") };
  }
}
