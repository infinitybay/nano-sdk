import { Result } from "../../types/result";
import { SeedString } from "../../types/seed";
import { bytesToHex, hexToBytes } from "./hex-converter";

export function seedToBytes(seed: SeedString): Uint8Array {
  const validatedSeed = SeedString().safeParse(seed);
  if (!validatedSeed.success) {
    throw new Error("Invalid seed value.");
  }

  return hexToBytes(validatedSeed.data);
}

export function safeSeedToBytes(seed: SeedString): Result<Uint8Array> {
  try {
    return { success: true, data: seedToBytes(seed) };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err : new Error("Unexpected error.") };
  }
}

export function bytesToSeed(seedBytes: Uint8Array): SeedString {
  const hexResult = bytesToHex(seedBytes);
  const seedResult = SeedString().safeParse(hexResult);
  if (!seedResult.success) {
    throw new Error("Invalid seed byte array.");
  }

  return seedResult.data;
}

export function safeBytesToSeed(seedBytes: Uint8Array): Result<SeedString> {
  try {
    return { success: true, data: bytesToSeed(seedBytes) };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err : new Error("Unexpected error.") };
  }
}
