import { NonThrowing } from "../types/non-throwing";
import { PublicKeyString } from "../types/public-key";
import { Result } from "../types/result";
import { Throwing } from "../types/throwing";
import { CryptoError } from "./crypto-error";
import { CryptoErrorCode } from "./crypto-error-code";
import { derivePublicKeyFromPrivateKey } from "./derive-public-key-from-private-key";
import { generatePrivateKey } from "./generate-private-key";

export type GeneratePublicKeyParams = Record<never, never>;

export type GeneratePublicKeyResult = Result<
  PublicKeyString,
  CryptoError<
    | CryptoErrorCode.DerivePublicKeyFromPrivateKeyFailed
    | CryptoErrorCode.GeneratePrivateKeyFailed
    | CryptoErrorCode.Unexpected
  >
>;

export function generatePublicKey(): PublicKeyString;
export function generatePublicKey(params: GeneratePublicKeyParams & NonThrowing): GeneratePublicKeyResult;
export function generatePublicKey(params: GeneratePublicKeyParams & Throwing): PublicKeyString;
export function generatePublicKey(
  params: GeneratePublicKeyParams & (Throwing | NonThrowing)
): PublicKeyString | GeneratePublicKeyResult;
export function generatePublicKey(params?: GeneratePublicKeyParams & (Throwing | NonThrowing)) {
  const result = ((): GeneratePublicKeyResult => {
    try {
      const privateKeyResult = generatePrivateKey({ throwOnError: false });
      if (!privateKeyResult.success) {
        return Result.err(
          new CryptoError(CryptoErrorCode.GeneratePrivateKeyFailed, "Failed to generate private key.", {
            cause: privateKeyResult.error,
          })
        );
      }

      const publicKeyResult = derivePublicKeyFromPrivateKey({
        privateKey: privateKeyResult.data,
        throwOnError: false,
      });
      if (!publicKeyResult.success) {
        return Result.err(
          new CryptoError(
            CryptoErrorCode.DerivePublicKeyFromPrivateKeyFailed,
            "Failed to derive generated public key.",
            {
              cause: publicKeyResult.error,
            }
          )
        );
      }

      return Result.ok(publicKeyResult.data);
    } catch (e) {
      return Result.err(new CryptoError(CryptoErrorCode.Unexpected, "Unexpected error.", { cause: e }));
    }
  })();

  return Result.unwrap(result, params?.throwOnError);
}
