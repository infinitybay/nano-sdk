import { HashString } from "../../types/hash";
import { Result } from "../../types/result";
import { bytesToHex, hexToBytes } from "./hex-converter";

export function hashToBytes(hash: HashString): Uint8Array {
  const validatedHash = HashString().safeParse(hash);
  if (!validatedHash.success) {
    throw new Error("Invalid hash value.");
  }

  return hexToBytes(validatedHash.data);
}

export function safeHashToBytes(hash: HashString): Result<Uint8Array> {
  try {
    return { success: true, data: hashToBytes(hash) };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err : new Error("Unexpected error.") };
  }
}

export function bytesToHash(hashBytes: Uint8Array): HashString {
  const hexResult = bytesToHex(hashBytes);
  const validatedHash = HashString().safeParse(hexResult);
  if (!validatedHash.success) {
    throw new Error("Invalid hash byte array.");
  }

  return validatedHash.data;
}

export function safeBytesToHash(hashBytes: Uint8Array): Result<HashString> {
  try {
    return { success: true, data: bytesToHash(hashBytes) };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err : new Error("Unexpected error.") };
  }
}
