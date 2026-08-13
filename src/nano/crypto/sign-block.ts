import { StateBlock } from "../blocks/state-block";
import { NonThrowing } from "../types/non-throwing";
import { PrivateKeyString } from "../types/private-key";
import { Result } from "../types/result";
import { SignatureString } from "../types/signature";
import { Throwing } from "../types/throwing";
import { CryptoError } from "./crypto-error";
import { CryptoErrorCode } from "./crypto-error-code";
import { deriveAccountFromLink } from "./derive-account-from-link";
import { deriveAccountFromPrivateKey } from "./derive-account-from-private-key";
import { hashBlock } from "./hash-block";
import { signHash } from "./sign-hash";

export type SignBlockParams = {
  block: StateBlock;
  privateKey: PrivateKeyString;
};

export type SignBlockResult = Result<
  SignatureString,
  CryptoError<
    | CryptoErrorCode.BlockLinkMismatch
    | CryptoErrorCode.DeriveAccountFromLinkFailed
    | CryptoErrorCode.DeriveAccountFromPrivateKeyFailed
    | CryptoErrorCode.HashBlockFailed
    | CryptoErrorCode.InvalidBlock
    | CryptoErrorCode.KeyAccountMismatch
    | CryptoErrorCode.SignHashFailed
    | CryptoErrorCode.Unexpected
  >
>;

export function signBlock(params: SignBlockParams & NonThrowing): SignBlockResult;
export function signBlock(params: SignBlockParams & Throwing): SignatureString;
export function signBlock(params: SignBlockParams & (Throwing | NonThrowing)): SignatureString | SignBlockResult;
export function signBlock(params: SignBlockParams & (Throwing | NonThrowing)) {
  const result = ((): SignBlockResult => {
    try {
      const blockResult = StateBlock().safeParse(params.block);
      if (!blockResult.success) {
        return Result.err(new CryptoError(CryptoErrorCode.InvalidBlock, "Invalid state block."));
      }

      const block = blockResult.data;
      const accountResult = deriveAccountFromPrivateKey({ privateKey: params.privateKey, throwOnError: false });
      if (!accountResult.success) {
        return Result.err(
          new CryptoError(CryptoErrorCode.DeriveAccountFromPrivateKeyFailed, "Failed to derive signing account.", {
            cause: accountResult.error,
          })
        );
      }
      if (accountResult.data !== block.account) {
        return Result.err(
          new CryptoError(CryptoErrorCode.KeyAccountMismatch, "Private key does not belong to the block account.")
        );
      }

      const linkAsAccountResult = deriveAccountFromLink({ link: block.link, throwOnError: false });
      if (!linkAsAccountResult.success) {
        return Result.err(
          new CryptoError(CryptoErrorCode.DeriveAccountFromLinkFailed, "Failed to derive block link account.", {
            cause: linkAsAccountResult.error,
          })
        );
      }
      if (linkAsAccountResult.data !== block.link_as_account) {
        return Result.err(
          new CryptoError(CryptoErrorCode.BlockLinkMismatch, "Block link and link_as_account do not match.")
        );
      }

      const hashResult = hashBlock({ block, throwOnError: false });
      if (!hashResult.success) {
        return Result.err(
          new CryptoError(CryptoErrorCode.HashBlockFailed, "Failed to hash the state block.", {
            cause: hashResult.error,
          })
        );
      }

      const signatureResult = signHash({
        hash: hashResult.data,
        privateKey: params.privateKey,
        throwOnError: false,
      });
      if (!signatureResult.success) {
        return Result.err(
          new CryptoError(CryptoErrorCode.SignHashFailed, "Failed to sign the state block hash.", {
            cause: signatureResult.error,
          })
        );
      }

      return Result.ok(signatureResult.data);
    } catch (e) {
      return Result.err(new CryptoError(CryptoErrorCode.Unexpected, "Unexpected error.", { cause: e }));
    }
  })();

  return Result.unwrap(result, params.throwOnError);
}
