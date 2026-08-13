import { AccountString } from "../types/account";
import { LinkString } from "../types/link";
import { NonThrowing } from "../types/non-throwing";
import { PublicKeyString } from "../types/public-key";
import { Result } from "../types/result";
import { Throwing } from "../types/throwing";
import { CryptoError } from "./crypto-error";
import { CryptoErrorCode } from "./crypto-error-code";
import { deriveAccountFromPublicKey } from "./derive-account-from-public-key";

export type DeriveAccountFromLinkParams = {
  link: LinkString;
};

export type DeriveAccountFromLinkResult = Result<
  AccountString,
  CryptoError<
    CryptoErrorCode.DeriveAccountFromPublicKeyFailed | CryptoErrorCode.InvalidLink | CryptoErrorCode.Unexpected
  >
>;

export function deriveAccountFromLink(params: DeriveAccountFromLinkParams & NonThrowing): DeriveAccountFromLinkResult;
export function deriveAccountFromLink(params: DeriveAccountFromLinkParams & Throwing): AccountString;
export function deriveAccountFromLink(
  params: DeriveAccountFromLinkParams & (Throwing | NonThrowing)
): AccountString | DeriveAccountFromLinkResult;
export function deriveAccountFromLink(params: DeriveAccountFromLinkParams & (Throwing | NonThrowing)) {
  const result = ((): DeriveAccountFromLinkResult => {
    try {
      const publicKeyResult = PublicKeyString().safeParse(params.link);
      if (!publicKeyResult.success) {
        return Result.err(new CryptoError(CryptoErrorCode.InvalidLink, "Invalid link: cannot convert to public key."));
      }

      const accountResult = deriveAccountFromPublicKey({ publicKey: publicKeyResult.data, throwOnError: false });
      if (!accountResult.success) {
        return Result.err(
          new CryptoError(
            CryptoErrorCode.DeriveAccountFromPublicKeyFailed,
            "Failed to derive account from link public key.",
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
