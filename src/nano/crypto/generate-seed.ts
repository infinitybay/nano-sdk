import { NonThrowing } from "../types/non-throwing";
import { Result } from "../types/result";
import { SeedString } from "../types/seed";
import { Throwing } from "../types/throwing";
import { bytesToSeed } from "./conversion/seed-converter";
import { CryptoError } from "./crypto-error";
import { CryptoErrorCode } from "./crypto-error-code";
import { generateRandomBytes } from "./generate-random-bytes";

export type GenerateSeedParams = Record<never, never>;

export type GenerateSeedResult = Result<
  SeedString,
  CryptoError<
    CryptoErrorCode.BytesToSeedFailed | CryptoErrorCode.GenerateRandomBytesFailed | CryptoErrorCode.Unexpected
  >
>;

export function generateSeed(): SeedString;
export function generateSeed(params: GenerateSeedParams & NonThrowing): GenerateSeedResult;
export function generateSeed(params: GenerateSeedParams & Throwing): SeedString;
export function generateSeed(params: GenerateSeedParams & (Throwing | NonThrowing)): SeedString | GenerateSeedResult;
export function generateSeed(params?: GenerateSeedParams & (Throwing | NonThrowing)) {
  const result = ((): GenerateSeedResult => {
    try {
      const randomSeedBytes = generateRandomBytes({ count: 32, throwOnError: false });
      if (!randomSeedBytes.success) {
        return Result.err(
          new CryptoError(CryptoErrorCode.GenerateRandomBytesFailed, "Failed to generate random seed bytes.", {
            cause: randomSeedBytes.error,
          })
        );
      }

      const seedResult = bytesToSeed({ seedBytes: randomSeedBytes.data, throwOnError: false });
      if (!seedResult.success) {
        return Result.err(
          new CryptoError(CryptoErrorCode.BytesToSeedFailed, "Failed to convert random bytes to a seed.", {
            cause: seedResult.error,
          })
        );
      }

      return Result.ok(seedResult.data);
    } catch (e) {
      return Result.err(new CryptoError(CryptoErrorCode.Unexpected, "Unexpected error.", { cause: e }));
    }
  })();

  return Result.unwrap(result, params?.throwOnError);
}
