import { StateBlock } from "../blocks/state-block";
import { NonThrowing } from "../types/non-throwing";
import { PublicKeyString } from "../types/public-key";
import { PredicateResult, Result } from "../types/result";
import { Throwing } from "../types/throwing";
import { CryptoError } from "./crypto-error";
import { CryptoErrorCode } from "./crypto-error-code";
import { derivePublicKeyFromAccount } from "./derive-public-key-from-account";
import { hashBlock } from "./hash-block";
import { verifySignature } from "./verify-signature";

export type VerifyBlockParams = {
  block: StateBlock;
  publicKey?: PublicKeyString;
};

export type VerifyBlockResult = PredicateResult<
  "checked",
  "validBlock",
  CryptoError<
    | CryptoErrorCode.DerivePublicKeyFromBlockAccountFailed
    | CryptoErrorCode.DerivePublicKeyFromBlockLinkFailed
    | CryptoErrorCode.HashBlockFailed
    | CryptoErrorCode.InvalidBlock
    | CryptoErrorCode.Unexpected
    | CryptoErrorCode.VerifySignatureFailed
  >
>;

export function verifyBlock(params: VerifyBlockParams & NonThrowing): VerifyBlockResult;
export function verifyBlock(params: VerifyBlockParams & Throwing): boolean;
export function verifyBlock(params: VerifyBlockParams & (Throwing | NonThrowing)): VerifyBlockResult | boolean;
export function verifyBlock(params: VerifyBlockParams & (Throwing | NonThrowing)) {
  const result = ((): Result<boolean, Extract<VerifyBlockResult, { checked: false }>["error"]> => {
    try {
      const blockResult = StateBlock().safeParse(params.block);
      if (!blockResult.success) {
        return Result.err(new CryptoError(CryptoErrorCode.InvalidBlock, "Invalid state block."));
      }
      const block = blockResult.data;

      const linkPublicKeyResult = derivePublicKeyFromAccount({
        account: block.link_as_account,
        throwOnError: false,
      });
      if (!linkPublicKeyResult.success) {
        return Result.err(
          new CryptoError(
            CryptoErrorCode.DerivePublicKeyFromBlockLinkFailed,
            "Failed to derive public key from block link account.",
            { cause: linkPublicKeyResult.error }
          )
        );
      }
      if (block.link !== linkPublicKeyResult.data) {
        return Result.ok(false);
      }

      const hashResult = hashBlock({ block, throwOnError: false });
      if (!hashResult.success) {
        return Result.err(
          new CryptoError(CryptoErrorCode.HashBlockFailed, "Failed to hash the state block.", {
            cause: hashResult.error,
          })
        );
      }

      let publicKey = params.publicKey;
      if (publicKey === undefined) {
        const publicKeyResult = derivePublicKeyFromAccount({ account: block.account, throwOnError: false });
        if (!publicKeyResult.success) {
          return Result.err(
            new CryptoError(
              CryptoErrorCode.DerivePublicKeyFromBlockAccountFailed,
              "Failed to derive public key from block account.",
              { cause: publicKeyResult.error }
            )
          );
        }
        publicKey = publicKeyResult.data;
      }

      const signatureResult = verifySignature({
        hash: hashResult.data,
        publicKey,
        signature: block.signature,
        throwOnError: false,
      });
      if (!signatureResult.checked) {
        return Result.err(
          new CryptoError(CryptoErrorCode.VerifySignatureFailed, "Failed to verify block signature.", {
            cause: signatureResult.error,
          })
        );
      }

      return Result.ok(signatureResult.validSignature);
    } catch (e) {
      return Result.err(new CryptoError(CryptoErrorCode.Unexpected, "Unexpected error.", { cause: e }));
    }
  })();

  if (params.throwOnError === false) {
    if (result.success) {
      return { checked: true, validBlock: result.data };
    }

    return { checked: false, error: result.error };
  }

  return Result.unwrap(result, params.throwOnError);
}
