import { blake2bFinal, blake2bInit, blake2bUpdate } from "blakejs";

import { PrivateKeyString } from "../types/private-key";
import { Result } from "../types/result";
import { SeedIndex, SeedString } from "../types/seed";
import { hexToBytes } from "./conversion/hex-converter";
import { bytesToPrivateKey } from "./conversion/private-key-converter";

export function derivePrivateKeyFromSeed(seed: SeedString, seedIndex: SeedIndex): PrivateKeyString {
  const validatedSeed = SeedString().safeParse(seed);
  if (!validatedSeed.success) {
    throw new Error("Invalid seed value.");
  }

  const validatedIndex = SeedIndex().safeParse(seedIndex);
  if (!validatedIndex.success) {
    throw new Error("Invalid seed index.");
  }

  const seedBytes = hexToBytes(validatedSeed.data);

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
    return bytesToPrivateKey(privateKeyBytes);
  } catch (_err) {
    throw new Error("Derived private key is invalid.");
  }
}

export function safeDerivePrivateKeyFromSeed(seed: SeedString, seedIndex: SeedIndex): Result<PrivateKeyString> {
  try {
    return { success: true, data: derivePrivateKeyFromSeed(seed, seedIndex) };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err : new Error("Unexpected error.") };
  }
}
