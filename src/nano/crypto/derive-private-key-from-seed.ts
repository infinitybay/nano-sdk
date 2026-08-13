import { blake2bFinal, blake2bInit, blake2bUpdate } from "blakejs";

import { NonThrowing } from "../types/non-throwing";
import { PrivateKeyString } from "../types/private-key";
import { Result } from "../types/result";
import { SeedIndex, SeedString } from "../types/seed";
import { Throwing } from "../types/throwing";
import { hexToBytes } from "./conversion/hex-converter";
import { bytesToPrivateKey } from "./conversion/private-key-converter";
import { CryptoError } from "./crypto-error";
import { CryptoErrorCode } from "./crypto-error-code";

export type DerivePrivateKeyFromSeedParams = {
  seed: SeedString;
  seedIndex: SeedIndex;
};

export type DerivePrivateKeyFromSeedResult = Result<
  PrivateKeyString,
  CryptoError<
    | CryptoErrorCode.DerivePrivateKeyFailed
    | CryptoErrorCode.HexToBytesFailed
    | CryptoErrorCode.InvalidDerivedPrivateKey
    | CryptoErrorCode.InvalidSeed
    | CryptoErrorCode.InvalidSeedIndex
    | CryptoErrorCode.Unexpected
  >
>;

export function derivePrivateKeyFromSeed(
  params: DerivePrivateKeyFromSeedParams & NonThrowing
): DerivePrivateKeyFromSeedResult;
export function derivePrivateKeyFromSeed(params: DerivePrivateKeyFromSeedParams & Throwing): PrivateKeyString;
export function derivePrivateKeyFromSeed(
  params: DerivePrivateKeyFromSeedParams & (Throwing | NonThrowing)
): PrivateKeyString | DerivePrivateKeyFromSeedResult;
export function derivePrivateKeyFromSeed(params: DerivePrivateKeyFromSeedParams & (Throwing | NonThrowing)) {
  const result = ((): DerivePrivateKeyFromSeedResult => {
    try {
      const validatedSeed = SeedString().safeParse(params.seed);
      if (!validatedSeed.success) {
        return Result.err(new CryptoError(CryptoErrorCode.InvalidSeed, "Invalid seed value."));
      }

      const validatedIndex = SeedIndex().safeParse(params.seedIndex);
      if (!validatedIndex.success) {
        return Result.err(new CryptoError(CryptoErrorCode.InvalidSeedIndex, "Invalid seed index."));
      }

      const seedBytes = hexToBytes({ hex: validatedSeed.data, throwOnError: false });
      if (!seedBytes.success) {
        return Result.err(
          new CryptoError(CryptoErrorCode.HexToBytesFailed, "Failed to convert seed to bytes.", {
            cause: seedBytes.error,
          })
        );
      }

      let privateKeyBytes: Uint8Array;
      try {
        const indexBuffer = new ArrayBuffer(4);
        const indexDataView = new DataView(indexBuffer);
        indexDataView.setUint32(0, validatedIndex.data);
        const indexBytes = new Uint8Array(indexBuffer);

        const hashContext = blake2bInit(32);
        blake2bUpdate(hashContext, seedBytes.data);
        blake2bUpdate(hashContext, indexBytes);

        privateKeyBytes = blake2bFinal(hashContext);
      } catch (err) {
        return Result.err(
          new CryptoError(CryptoErrorCode.DerivePrivateKeyFailed, "Failed to derive private key bytes from seed.", {
            cause: err,
          })
        );
      }

      const privateKeyResult = bytesToPrivateKey({ privateKeyBytes, throwOnError: false });
      if (!privateKeyResult.success) {
        return Result.err(
          new CryptoError(CryptoErrorCode.InvalidDerivedPrivateKey, "Derived private key is invalid.", {
            cause: privateKeyResult.error,
          })
        );
      }

      return Result.ok(privateKeyResult.data);
    } catch (e) {
      return Result.err(new CryptoError(CryptoErrorCode.Unexpected, "Unexpected error.", { cause: e }));
    }
  })();

  return Result.unwrap(result, params.throwOnError);
}
