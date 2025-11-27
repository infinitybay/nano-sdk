import { PrivateKeyString } from "../../types/private-key";
import { Result } from "../../types/result";
import { bytesToHex, hexToBytes } from "./hex-converter";

export function privateKeyToBytes(privateKey: PrivateKeyString): Uint8Array {
  const validatedPrivateKey = PrivateKeyString().safeParse(privateKey);
  if (!validatedPrivateKey.success) {
    throw new Error("Invalid private key value.");
  }

  return hexToBytes(validatedPrivateKey.data);
}

export function safePrivateKeyToBytes(privateKey: PrivateKeyString): Result<Uint8Array> {
  try {
    return { success: true, data: privateKeyToBytes(privateKey) };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err : new Error("Unexpected error.") };
  }
}

export function bytesToPrivateKey(privateKeyBytes: Uint8Array): PrivateKeyString {
  const hexResult = bytesToHex(privateKeyBytes);
  const privateKeyResult = PrivateKeyString().safeParse(hexResult);
  if (!privateKeyResult.success) {
    throw new Error("Invalid private key byte array.");
  }

  return privateKeyResult.data;
}

export function safeBytesToPrivateKey(privateKeyBytes: Uint8Array): Result<PrivateKeyString> {
  try {
    return { success: true, data: bytesToPrivateKey(privateKeyBytes) };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err : new Error("Unexpected error.") };
  }
}
