import { AccountString } from "../types/account";
import { NonThrowing } from "../types/non-throwing";
import { PublicKeyString } from "../types/public-key";
import { Result } from "../types/result";
import { Throwing } from "../types/throwing";
import { accountToBytes } from "./conversion/account-converter";
import { bytesToPublicKey } from "./conversion/public-key-converter";
import { CryptoError } from "./crypto-error";
import { CryptoErrorCode } from "./crypto-error-code";

export type DerivePublicKeyFromAccountParams = {
  account: AccountString;
};

export type DerivePublicKeyFromAccountResult = Result<
  PublicKeyString,
  CryptoError<
    | CryptoErrorCode.AccountToBytesFailed
    | CryptoErrorCode.BytesToPublicKeyFailed
    | CryptoErrorCode.InvalidAccount
    | CryptoErrorCode.Unexpected
  >
>;

export function derivePublicKeyFromAccount(
  params: DerivePublicKeyFromAccountParams & NonThrowing
): DerivePublicKeyFromAccountResult;
export function derivePublicKeyFromAccount(params: DerivePublicKeyFromAccountParams & Throwing): PublicKeyString;
export function derivePublicKeyFromAccount(
  params: DerivePublicKeyFromAccountParams & (Throwing | NonThrowing)
): PublicKeyString | DerivePublicKeyFromAccountResult;
export function derivePublicKeyFromAccount(params: DerivePublicKeyFromAccountParams & (Throwing | NonThrowing)) {
  const result = ((): DerivePublicKeyFromAccountResult => {
    try {
      const validatedAccount = AccountString().safeParse(params.account);
      if (!validatedAccount.success) {
        return Result.err(new CryptoError(CryptoErrorCode.InvalidAccount, "Invalid account value."));
      }

      const publicKeyBytes = accountToBytes({ account: validatedAccount.data, throwOnError: false });
      if (!publicKeyBytes.success) {
        return Result.err(
          new CryptoError(CryptoErrorCode.AccountToBytesFailed, "Failed to convert account to public key bytes.", {
            cause: publicKeyBytes.error,
          })
        );
      }

      const publicKeyResult = bytesToPublicKey({ publicKeyBytes: publicKeyBytes.data, throwOnError: false });
      if (!publicKeyResult.success) {
        return Result.err(
          new CryptoError(CryptoErrorCode.BytesToPublicKeyFailed, "Failed to convert bytes to a public key.", {
            cause: publicKeyResult.error,
          })
        );
      }

      return Result.ok(publicKeyResult.data);
    } catch (e) {
      return Result.err(new CryptoError(CryptoErrorCode.Unexpected, "Unexpected error.", { cause: e }));
    }
  })();

  return Result.unwrap(result, params.throwOnError);
}
