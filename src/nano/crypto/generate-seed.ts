import { Result } from "../types/result";
import { SeedString } from "../types/seed";
import { bytesToSeed } from "./conversion/seed-converter";
import { generateRandomBytes } from "./generate-random-bytes";

export function generateSeed(): SeedString {
  const randomSeedBytes = generateRandomBytes(32);
  return bytesToSeed(randomSeedBytes);
}

export function safeGenerateSeed(): Result<SeedString> {
  try {
    return { success: true, data: generateSeed() };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err : new Error("Unexpected error.") };
  }
}
