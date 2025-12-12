import { blake2bFinal, blake2bInit, blake2bUpdate } from "blakejs";

import { NonThrowing } from "../types/non-throwing";
import { PrivateKeyString } from "../types/private-key";
import { Result } from "../types/result";
import { SeedIndex, SeedString } from "../types/seed";
import { Throwing } from "../types/throwing";
import { hexToBytes } from "./conversion/hex-converter";
import { bytesToPrivateKey } from "./conversion/private-key-converter";

type DerivePrivateKeyFromSeedParams = {
  seed: SeedString;
  seedIndex: SeedIndex;
} & (Throwing | NonThrowing);

function derivePrivateKeyFromSeedThrowing(params: DerivePrivateKeyFromSeedParams & Throwing): PrivateKeyString {
  const validatedSeed = SeedString().safeParse(params.seed);
  if (!validatedSeed.success) {
    throw new Error("Invalid seed value.");
  }

  const validatedIndex = SeedIndex().safeParse(params.seedIndex);
  if (!validatedIndex.success) {
    throw new Error("Invalid seed index.");
  }

  const seedBytes = hexToBytes({ hex: validatedSeed.data, throwOnError: true });

  let privateKeyBytes: Uint8Array;
  try {
    const indexBuffer = new ArrayBuffer(4);
    const indexDataView = new DataView(indexBuffer);
    indexDataView.setUint32(0, validatedIndex.data);
    const indexBytes = new Uint8Array(indexBuffer);

    const hashContext = blake2bInit(32);
    blake2bUpdate(hashContext, seedBytes);
    blake2bUpdate(hashContext, indexBytes);

    privateKeyBytes = blake2bFinal(hashContext);
  } catch (_err) {
    throw new Error("Failed to derive private key bytes from seed.");
  }

  try {
    return bytesToPrivateKey({ privateKeyBytes, throwOnError: true });
  } catch (_err) {
    throw new Error("Derived private key is invalid.");
  }
}

function derivePrivateKeyFromSeedNonThrowing(
  params: DerivePrivateKeyFromSeedParams & NonThrowing
): Result<PrivateKeyString> {
  try {
    return {
      success: true,
      data: derivePrivateKeyFromSeedThrowing({ ...params, throwOnError: true }),
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e : new Error("Unexpected error."),
    };
  }
}

export function derivePrivateKeyFromSeed(
  params: DerivePrivateKeyFromSeedParams & NonThrowing
): Result<PrivateKeyString>;
export function derivePrivateKeyFromSeed(params: DerivePrivateKeyFromSeedParams & Throwing): PrivateKeyString;
export function derivePrivateKeyFromSeed(
  params: DerivePrivateKeyFromSeedParams
): PrivateKeyString | Result<PrivateKeyString>;
export function derivePrivateKeyFromSeed(params: DerivePrivateKeyFromSeedParams) {
  if (params.throwOnError === true) {
    return derivePrivateKeyFromSeedThrowing({ ...params, throwOnError: true });
  } else {
    return derivePrivateKeyFromSeedNonThrowing({ ...params, throwOnError: false });
  }
}
