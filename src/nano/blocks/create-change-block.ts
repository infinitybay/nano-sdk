import { deriveAccountFromLink } from "../crypto/derive-account-from-link";
import { hashBlock } from "../crypto/hash-block";
import { signBlock } from "../crypto/sign-block";
import { AccountString } from "../types/account";
import { HashStrings } from "../types/hash";
import { NonThrowing } from "../types/non-throwing";
import { PrivateKeyString } from "../types/private-key";
import { Result } from "../types/result";
import { SignatureStrings } from "../types/signature";
import { Throwing } from "../types/throwing";
import { WorkStrings } from "../types/work";
import { BlockError } from "./block-error";
import { BlockErrorCode } from "./block-error-code";
import { StateBlock } from "./state-block";

export type CreateChangeBlockParams = {
  frontierBlock: StateBlock;
  representative: AccountString;
  privateKey?: PrivateKeyString;
};

export type CreateChangeBlockResult = Result<
  StateBlock,
  BlockError<
    | BlockErrorCode.DeriveAccountFromBlockLinkFailed
    | BlockErrorCode.DeriveAccountFromFrontierLinkFailed
    | BlockErrorCode.FrontierLinkMismatch
    | BlockErrorCode.HashFrontierBlockFailed
    | BlockErrorCode.InvalidCreatedBlock
    | BlockErrorCode.InvalidFrontierBlock
    | BlockErrorCode.InvalidRepresentative
    | BlockErrorCode.SignBlockFailed
    | BlockErrorCode.Unexpected
  >
>;

export function createChangeBlock(params: CreateChangeBlockParams & NonThrowing): CreateChangeBlockResult;
export function createChangeBlock(params: CreateChangeBlockParams & Throwing): StateBlock;
export function createChangeBlock(
  params: CreateChangeBlockParams & (Throwing | NonThrowing)
): StateBlock | CreateChangeBlockResult;
export function createChangeBlock(params: CreateChangeBlockParams & (Throwing | NonThrowing)) {
  const result = ((): CreateChangeBlockResult => {
    try {
      const frontierBlockResult = StateBlock().safeParse(params.frontierBlock);
      if (!frontierBlockResult.success) {
        return Result.err(new BlockError(BlockErrorCode.InvalidFrontierBlock, "Invalid frontier state block."));
      }
      const frontierBlock = frontierBlockResult.data;

      const frontierLinkAsAccountResult = deriveAccountFromLink({ link: frontierBlock.link, throwOnError: false });
      if (!frontierLinkAsAccountResult.success) {
        return Result.err(
          new BlockError(
            BlockErrorCode.DeriveAccountFromFrontierLinkFailed,
            "Failed to derive the frontier block link account.",
            {
              cause: frontierLinkAsAccountResult.error,
            }
          )
        );
      }
      if (frontierLinkAsAccountResult.data !== frontierBlock.link_as_account) {
        return Result.err(
          new BlockError(BlockErrorCode.FrontierLinkMismatch, "Frontier block link and link_as_account do not match.")
        );
      }

      const representativeResult = AccountString().safeParse(params.representative);
      if (!representativeResult.success) {
        return Result.err(new BlockError(BlockErrorCode.InvalidRepresentative, "Invalid representative account."));
      }

      const previousResult = hashBlock({ block: frontierBlock, throwOnError: false });
      if (!previousResult.success) {
        return Result.err(
          new BlockError(BlockErrorCode.HashFrontierBlockFailed, "Failed to hash the frontier block.", {
            cause: previousResult.error,
          })
        );
      }

      const link = HashStrings.zero();
      const linkAsAccountResult = deriveAccountFromLink({ link, throwOnError: false });
      if (!linkAsAccountResult.success) {
        return Result.err(
          new BlockError(BlockErrorCode.DeriveAccountFromBlockLinkFailed, "Failed to derive the block link account.", {
            cause: linkAsAccountResult.error,
          })
        );
      }

      const block: StateBlock = {
        type: "state",
        account: frontierBlock.account,
        previous: previousResult.data,
        representative: representativeResult.data,
        balance: frontierBlock.balance,
        link,
        link_as_account: linkAsAccountResult.data,
        signature: SignatureStrings.zero(),
        work: WorkStrings.zero(),
      };

      if (params.privateKey !== undefined) {
        const signatureResult = signBlock({
          block,
          privateKey: params.privateKey,
          throwOnError: false,
        });
        if (!signatureResult.success) {
          return Result.err(
            new BlockError(BlockErrorCode.SignBlockFailed, "Failed to sign the state block.", {
              cause: signatureResult.error,
            })
          );
        }
        block.signature = signatureResult.data;
      }

      const blockResult = StateBlock().safeParse(block);
      if (!blockResult.success) {
        return Result.err(new BlockError(BlockErrorCode.InvalidCreatedBlock, "Failed to create a valid state block."));
      }

      return Result.ok(block);
    } catch (e) {
      return Result.err(new BlockError(BlockErrorCode.Unexpected, "Unexpected error.", { cause: e }));
    }
  })();
  return Result.unwrap(result, params.throwOnError);
}
