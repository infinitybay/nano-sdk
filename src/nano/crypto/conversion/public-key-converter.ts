import { PublicKeyString } from "../../types/public-key";
import { Result } from "../../types/result";
import { bytesToHex, hexToBytes } from "./hex-converter";

export function publicKeyToBytes(publicKey: PublicKeyString): Uint8Array {
  const validatedPublicKey = PublicKeyString().safeParse(publicKey);
  if (!validatedPublicKey.success) {
    throw new Error("Invalid public key value.");
  }

  return hexToBytes(validatedPublicKey.data);
}

export function safePublicKeyToBytes(publicKey: PublicKeyString): Result<Uint8Array> {
  try {
    return { success: true, data: publicKeyToBytes(publicKey) };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err : new Error("Unexpected error.") };
  }
}

export function bytesToPublicKey(publicKeyBytes: Uint8Array): PublicKeyString {
  const hexResult = bytesToHex(publicKeyBytes);
  const publicKeyResult = PublicKeyString().safeParse(hexResult);
  if (!publicKeyResult.success) {
    throw new Error("Invalid public key byte array.");
  }

  return publicKeyResult.data;
}

export function safeBytesToPublicKey(publicKeyBytes: Uint8Array): Result<PublicKeyString> {
  try {
    return { success: true, data: bytesToPublicKey(publicKeyBytes) };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err : new Error("Unexpected error.") };
  }
}
