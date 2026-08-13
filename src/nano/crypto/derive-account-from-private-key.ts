import { AccountString } from "../types/account";
import { NonThrowing } from "../types/non-throwing";
import { PrivateKeyString } from "../types/private-key";
import { Result } from "../types/result";
import { Throwing } from "../types/throwing";
import { CryptoError } from "./crypto-error";
import { CryptoErrorCode } from "./crypto-error-code";
import { deriveAccountFromPublicKey } from "./derive-account-from-public-key";
import { derivePublicKeyFromPrivateKey } from "./derive-public-key-from-private-key";

export type DeriveAccountFromPrivateKeyParams = {
  privateKey: PrivateKeyString;
};

export type DeriveAccountFromPrivateKeyResult = Result<
  AccountString,
  CryptoError<
    | CryptoErrorCode.DeriveAccountFromPublicKeyFailed
    | CryptoErrorCode.DerivePublicKeyFromPrivateKeyFailed
    | CryptoErrorCode.Unexpected
  >
>;

export function deriveAccountFromPrivateKey(
  params: DeriveAccountFromPrivateKeyParams & NonThrowing
): DeriveAccountFromPrivateKeyResult;
export function deriveAccountFromPrivateKey(params: DeriveAccountFromPrivateKeyParams & Throwing): AccountString;
export function deriveAccountFromPrivateKey(
  params: DeriveAccountFromPrivateKeyParams & (Throwing | NonThrowing)
): AccountString | DeriveAccountFromPrivateKeyResult;
export function deriveAccountFromPrivateKey(params: DeriveAccountFromPrivateKeyParams & (Throwing | NonThrowing)) {
  const result = ((): DeriveAccountFromPrivateKeyResult => {
    try {
      const publicKeyResult = derivePublicKeyFromPrivateKey({ privateKey: params.privateKey, throwOnError: false });
      if (!publicKeyResult.success) {
        return Result.err(
          new CryptoError(
            CryptoErrorCode.DerivePublicKeyFromPrivateKeyFailed,
            "Failed to derive public key from private key.",
            { cause: publicKeyResult.error }
          )
        );
      }

      const accountResult = deriveAccountFromPublicKey({ publicKey: publicKeyResult.data, throwOnError: false });
      if (!accountResult.success) {
        return Result.err(
          new CryptoError(
            CryptoErrorCode.DeriveAccountFromPublicKeyFailed,
            "Failed to derive account from public key.",
            { cause: accountResult.error }
          )
        );
      }

      return Result.ok(accountResult.data);
    } catch (e) {
      return Result.err(new CryptoError(CryptoErrorCode.Unexpected, "Unexpected error.", { cause: e }));
    }
  })();

  return Result.unwrap(result, params.throwOnError);
}
