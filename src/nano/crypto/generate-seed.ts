import { NonThrowing } from "../types/non-throwing";
import { Result } from "../types/result";
import { SeedString } from "../types/seed";
import { Throwing } from "../types/throwing";
import { bytesToSeed } from "./conversion/seed-converter";
import { generateRandomBytes } from "./generate-random-bytes";

type GenerateSeedParams = {} & (Throwing | NonThrowing);

function generateSeedThrowing(_params: GenerateSeedParams & Throwing): SeedString {
  const randomSeedBytes = generateRandomBytes({ count: 32, throwOnError: true });
  return bytesToSeed({ seedBytes: randomSeedBytes, throwOnError: true });
}

function generateSeedNonThrowing(params: GenerateSeedParams & NonThrowing): Result<SeedString> {
  try {
    return {
      success: true,
      data: generateSeedThrowing({ ...params, throwOnError: true }),
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e : new Error("Unexpected error."),
    };
  }
}

export function generateSeed(params: GenerateSeedParams & NonThrowing): Result<SeedString>;
export function generateSeed(params: GenerateSeedParams & Throwing): SeedString;
export function generateSeed(params: GenerateSeedParams): SeedString | Result<SeedString>;
export function generateSeed(params: GenerateSeedParams = {}) {
  if (params.throwOnError === false) {
    return generateSeedNonThrowing({ ...params, throwOnError: false });
  } else {
    return generateSeedThrowing({ ...params, throwOnError: true });
  }
}
