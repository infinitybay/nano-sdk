import { deriveAccountFromLink } from "../crypto/derive-account-from-link";
import { hashBlock } from "../crypto/hash-block";
import { signBlock } from "../crypto/sign-block";
import { AccountString } from "../types/account";
import { RawAmount, RawAmountString } from "../types/amount";
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

export type CreateOpenBlockParams = {
  amount: RawAmount | RawAmountString;
  representative: AccountString;
  sendBlock: StateBlock;
  privateKey?: PrivateKeyString;
};

export type CreateOpenBlockResult = Result<
  StateBlock,
  BlockError<
    | BlockErrorCode.DeriveAccountFromBlockLinkFailed
    | BlockErrorCode.DeriveAccountFromSendLinkFailed
    | BlockErrorCode.HashSendBlockFailed
    | BlockErrorCode.InvalidAmount
    | BlockErrorCode.InvalidCreatedBlock
    | BlockErrorCode.InvalidRepresentative
    | BlockErrorCode.InvalidSendBlock
    | BlockErrorCode.NegativeAmount
    | BlockErrorCode.SendLinkMismatch
    | BlockErrorCode.SignBlockFailed
    | BlockErrorCode.Unexpected
  >
>;

export function createOpenBlock(params: CreateOpenBlockParams & NonThrowing): CreateOpenBlockResult;
export function createOpenBlock(params: CreateOpenBlockParams & Throwing): StateBlock;
export function createOpenBlock(
  params: CreateOpenBlockParams & (Throwing | NonThrowing)
): StateBlock | CreateOpenBlockResult;
export function createOpenBlock(params: CreateOpenBlockParams & (Throwing | NonThrowing)) {
  const result = ((): CreateOpenBlockResult => {
    try {
      const sendBlockResult = StateBlock().safeParse(params.sendBlock);
      if (!sendBlockResult.success) {
        return Result.err(new BlockError(BlockErrorCode.InvalidSendBlock, "Invalid send state block."));
      }
      const sendBlock = sendBlockResult.data;

      const accountResult = deriveAccountFromLink({ link: sendBlock.link, throwOnError: false });
      if (!accountResult.success) {
        return Result.err(
          new BlockError(
            BlockErrorCode.DeriveAccountFromSendLinkFailed,
            "Failed to derive the send block destination account.",
            {
              cause: accountResult.error,
            }
          )
        );
      }
      if (accountResult.data !== sendBlock.link_as_account) {
        return Result.err(
          new BlockError(BlockErrorCode.SendLinkMismatch, "Send block link and link_as_account do not match.")
        );
      }

      if (
        (typeof params.amount === "bigint" && params.amount < 0n) ||
        (typeof params.amount === "string" && params.amount.startsWith("-"))
      ) {
        return Result.err(
          new BlockError(BlockErrorCode.NegativeAmount, "Invalid amount: negative raw amounts are not allowed.")
        );
      }

      const amountResult = RawAmountString().safeParse(
        typeof params.amount === "bigint" ? params.amount.toString() : params.amount
      );
      if (!amountResult.success || amountResult.data === "0") {
        return Result.err(
          new BlockError(BlockErrorCode.InvalidAmount, "Invalid amount: expected a positive raw amount.")
        );
      }

      const representativeResult = AccountString().safeParse(params.representative);
      if (!representativeResult.success) {
        return Result.err(new BlockError(BlockErrorCode.InvalidRepresentative, "Invalid representative account."));
      }

      const sendBlockHashResult = hashBlock({ block: sendBlock, throwOnError: false });
      if (!sendBlockHashResult.success) {
        return Result.err(
          new BlockError(BlockErrorCode.HashSendBlockFailed, "Failed to hash the send block.", {
            cause: sendBlockHashResult.error,
          })
        );
      }

      const linkAsAccountResult = deriveAccountFromLink({ link: sendBlockHashResult.data, throwOnError: false });
      if (!linkAsAccountResult.success) {
        return Result.err(
          new BlockError(BlockErrorCode.DeriveAccountFromBlockLinkFailed, "Failed to derive the block link account.", {
            cause: linkAsAccountResult.error,
          })
        );
      }

      const block: StateBlock = {
        type: "state",
        account: accountResult.data,
        previous: HashStrings.zero(),
        representative: representativeResult.data,
        balance: amountResult.data,
        link: sendBlockHashResult.data,
        link_as_account: linkAsAccountResult.data,
        signature: SignatureStrings.zero(),
        work: WorkStrings.zero(),
      };

      if (params.privateKey !== undefined) {
        const signatureResult = signBlock({ block, privateKey: params.privateKey, throwOnError: false });
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
