import { NonThrowing } from "../../types/non-throwing";
import { Result } from "../../types/result";
import { SeedString } from "../../types/seed";
import { Throwing } from "../../types/throwing";
import { bytesToHex, hexToBytes } from "./hex-converter";

type SeedToBytesParams = {
  seed: SeedString;
} & (Throwing | NonThrowing);

function seedToBytesThrowing(params: SeedToBytesParams & Throwing): Uint8Array {
  const validatedSeed = SeedString().safeParse(params.seed);
  if (!validatedSeed.success) {
    throw new Error("Invalid seed value.");
  }

  return hexToBytes({ hex: validatedSeed.data, throwOnError: true });
}

function seedToBytesNonThrowing(params: SeedToBytesParams & NonThrowing): Result<Uint8Array> {
  try {
    return {
      success: true,
      data: seedToBytesThrowing({ ...params, throwOnError: true }),
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e : new Error("Unexpected error."),
    };
  }
}

export function seedToBytes(params: SeedToBytesParams & NonThrowing): Result<Uint8Array>;
export function seedToBytes(params: SeedToBytesParams & Throwing): Uint8Array;
export function seedToBytes(params: SeedToBytesParams): Uint8Array | Result<Uint8Array>;
export function seedToBytes(params: SeedToBytesParams) {
  if (params.throwOnError === false) {
    return seedToBytesNonThrowing({ ...params, throwOnError: false });
  } else {
    return seedToBytesThrowing({ ...params, throwOnError: true });
  }
}

type BytesToSeedParams = {
  seedBytes: Uint8Array;
} & (Throwing | NonThrowing);

function bytesToSeedThrowing(params: BytesToSeedParams & Throwing): SeedString {
  const hexResult = bytesToHex({ bytes: params.seedBytes, throwOnError: true });
  const seedResult = SeedString().safeParse(hexResult);
  if (!seedResult.success) {
    throw new Error("Invalid seed byte array.");
  }

  return seedResult.data;
}

function bytesToSeedNonThrowing(params: BytesToSeedParams & NonThrowing): Result<SeedString> {
  try {
    return {
      success: true,
      data: bytesToSeedThrowing({ ...params, throwOnError: true }),
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e : new Error("Unexpected error."),
    };
  }
}

export function bytesToSeed(params: BytesToSeedParams & NonThrowing): Result<SeedString>;
export function bytesToSeed(params: BytesToSeedParams & Throwing): SeedString;
export function bytesToSeed(params: BytesToSeedParams): SeedString | Result<SeedString>;
export function bytesToSeed(params: BytesToSeedParams) {
  if (params.throwOnError === false) {
    return bytesToSeedNonThrowing({ ...params, throwOnError: false });
  } else {
    return bytesToSeedThrowing({ ...params, throwOnError: true });
  }
}
