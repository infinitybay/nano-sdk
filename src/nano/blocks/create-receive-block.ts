import { deriveAccountFromLink } from "../crypto/derive-account-from-link";
import { hashBlock } from "../crypto/hash-block";
import { signBlock } from "../crypto/sign-block";
import { rawPlus } from "../math/raw-plus";
import { AccountString } from "../types/account";
import { RawAmount, RawAmountString } from "../types/amount";
import { NonThrowing } from "../types/non-throwing";
import { PrivateKeyString } from "../types/private-key";
import { Result } from "../types/result";
import { SignatureStrings } from "../types/signature";
import { Throwing } from "../types/throwing";
import { WorkStrings } from "../types/work";
import { BlockError } from "./block-error";
import { BlockErrorCode } from "./block-error-code";
import { StateBlock } from "./state-block";

export type CreateReceiveBlockParams = {
  amount: RawAmount | RawAmountString;
  frontierBlock: StateBlock;
  sendBlock: StateBlock;
  privateKey?: PrivateKeyString;
  representative?: AccountString;
};

export type CreateReceiveBlockResult = Result<
  StateBlock,
  BlockError<
    | BlockErrorCode.BalanceOutOfRange
    | BlockErrorCode.DeriveAccountFromBlockLinkFailed
    | BlockErrorCode.DeriveAccountFromFrontierLinkFailed
    | BlockErrorCode.DeriveAccountFromSendLinkFailed
    | BlockErrorCode.FrontierLinkMismatch
    | BlockErrorCode.HashFrontierBlockFailed
    | BlockErrorCode.HashSendBlockFailed
    | BlockErrorCode.InvalidAmount
    | BlockErrorCode.InvalidCreatedBlock
    | BlockErrorCode.InvalidFrontierBlock
    | BlockErrorCode.InvalidRepresentative
    | BlockErrorCode.InvalidSendBlock
    | BlockErrorCode.NegativeAmount
    | BlockErrorCode.SendDestinationMismatch
    | BlockErrorCode.SendLinkMismatch
    | BlockErrorCode.SignBlockFailed
    | BlockErrorCode.Unexpected
  >
>;

export function createReceiveBlock(params: CreateReceiveBlockParams & NonThrowing): CreateReceiveBlockResult;
export function createReceiveBlock(params: CreateReceiveBlockParams & Throwing): StateBlock;
export function createReceiveBlock(
  params: CreateReceiveBlockParams & (Throwing | NonThrowing)
): StateBlock | CreateReceiveBlockResult;
export function createReceiveBlock(params: CreateReceiveBlockParams & (Throwing | NonThrowing)) {
  const result = ((): CreateReceiveBlockResult => {
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

      const sendBlockResult = StateBlock().safeParse(params.sendBlock);
      if (!sendBlockResult.success) {
        return Result.err(new BlockError(BlockErrorCode.InvalidSendBlock, "Invalid send state block."));
      }
      const sendBlock = sendBlockResult.data;

      const destinationResult = deriveAccountFromLink({ link: sendBlock.link, throwOnError: false });
      if (!destinationResult.success) {
        return Result.err(
          new BlockError(
            BlockErrorCode.DeriveAccountFromSendLinkFailed,
            "Failed to derive the send block destination account.",
            {
              cause: destinationResult.error,
            }
          )
        );
      }
      if (destinationResult.data !== sendBlock.link_as_account) {
        return Result.err(
          new BlockError(BlockErrorCode.SendLinkMismatch, "Send block link and link_as_account do not match.")
        );
      }
      if (destinationResult.data !== frontierBlock.account) {
        return Result.err(
          new BlockError(
            BlockErrorCode.SendDestinationMismatch,
            "Send block destination does not match the receiving account."
          )
        );
      }

      const sendBlockHashResult = hashBlock({ block: sendBlock, throwOnError: false });
      if (!sendBlockHashResult.success) {
        return Result.err(
          new BlockError(BlockErrorCode.HashSendBlockFailed, "Failed to hash the send block.", {
            cause: sendBlockHashResult.error,
          })
        );
      }

      const representativeResult = AccountString().safeParse(params.representative ?? frontierBlock.representative);
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

      const balanceResult = rawPlus({ raw: frontierBlock.balance, addend: amountResult.data, throwOnError: false });
      if (!balanceResult.success) {
        return Result.err(
          new BlockError(BlockErrorCode.BalanceOutOfRange, "The resulting balance exceeds the raw amount range.", {
            cause: balanceResult.error,
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
        account: frontierBlock.account,
        previous: previousResult.data,
        representative: representativeResult.data,
        balance: balanceResult.data,
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
