import { NonThrowing } from "../types/non-throwing";
import { PrivateKeyString } from "../types/private-key";
import { Result } from "../types/result";
import { Throwing } from "../types/throwing";
import { CryptoError } from "./crypto-error";
import { CryptoErrorCode } from "./crypto-error-code";
import { generateSeed } from "./generate-seed";

export type GeneratePrivateKeyParams = Record<never, never>;

export type GeneratePrivateKeyResult = Result<
  PrivateKeyString,
  CryptoError<
    CryptoErrorCode.GenerateSeedFailed | CryptoErrorCode.InvalidGeneratedPrivateKey | CryptoErrorCode.Unexpected
  >
>;

export function generatePrivateKey(): PrivateKeyString;
export function generatePrivateKey(params: GeneratePrivateKeyParams & NonThrowing): GeneratePrivateKeyResult;
export function generatePrivateKey(params: GeneratePrivateKeyParams & Throwing): PrivateKeyString;
export function generatePrivateKey(
  params: GeneratePrivateKeyParams & (Throwing | NonThrowing)
): PrivateKeyString | GeneratePrivateKeyResult;
export function generatePrivateKey(params?: GeneratePrivateKeyParams & (Throwing | NonThrowing)) {
  const result = ((): GeneratePrivateKeyResult => {
    try {
      const seedResult = generateSeed({ throwOnError: false });
      if (!seedResult.success) {
        return Result.err(
          new CryptoError(CryptoErrorCode.GenerateSeedFailed, "Failed to generate seed.", { cause: seedResult.error })
        );
      }

      const privateKeyResult = PrivateKeyString().safeParse(seedResult.data);
      if (!privateKeyResult.success) {
        return Result.err(
          new CryptoError(CryptoErrorCode.InvalidGeneratedPrivateKey, "Generated private key is invalid.")
        );
      }
      return Result.ok(privateKeyResult.data);
    } catch (e) {
      return Result.err(new CryptoError(CryptoErrorCode.Unexpected, "Unexpected error.", { cause: e }));
    }
  })();

  return Result.unwrap(result, params?.throwOnError);
}
