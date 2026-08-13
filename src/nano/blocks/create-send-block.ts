import { deriveAccountFromLink } from "../crypto/derive-account-from-link";
import { derivePublicKeyFromAccount } from "../crypto/derive-public-key-from-account";
import { hashBlock } from "../crypto/hash-block";
import { signBlock } from "../crypto/sign-block";
import { rawMinus } from "../math/raw-minus";
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

export type CreateSendBlockParams = {
  amount: RawAmount | RawAmountString;
  destination: AccountString;
  frontierBlock: StateBlock;
  privateKey?: PrivateKeyString;
  representative?: AccountString;
};

export type CreateSendBlockResult = Result<
  StateBlock,
  BlockError<
    | BlockErrorCode.DeriveAccountFromFrontierLinkFailed
    | BlockErrorCode.DerivePublicKeyFromDestinationFailed
    | BlockErrorCode.FrontierLinkMismatch
    | BlockErrorCode.HashFrontierBlockFailed
    | BlockErrorCode.InsufficientBalance
    | BlockErrorCode.InvalidAmount
    | BlockErrorCode.InvalidCreatedBlock
    | BlockErrorCode.InvalidDestination
    | BlockErrorCode.InvalidFrontierBlock
    | BlockErrorCode.InvalidRepresentative
    | BlockErrorCode.NegativeAmount
    | BlockErrorCode.SignBlockFailed
    | BlockErrorCode.Unexpected
  >
>;

export function createSendBlock(params: CreateSendBlockParams & NonThrowing): CreateSendBlockResult;
export function createSendBlock(params: CreateSendBlockParams & Throwing): StateBlock;
export function createSendBlock(
  params: CreateSendBlockParams & (Throwing | NonThrowing)
): StateBlock | CreateSendBlockResult;
export function createSendBlock(params: CreateSendBlockParams & (Throwing | NonThrowing)) {
  const result = ((): CreateSendBlockResult => {
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

      const destinationResult = AccountString().safeParse(params.destination);
      if (!destinationResult.success) {
        return Result.err(new BlockError(BlockErrorCode.InvalidDestination, "Invalid destination account."));
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

      const balanceResult = rawMinus({
        raw: frontierBlock.balance,
        subtrahend: amountResult.data,
        throwOnError: false,
      });
      if (!balanceResult.success) {
        return Result.err(
          new BlockError(BlockErrorCode.InsufficientBalance, "The send amount exceeds the frontier balance.", {
            cause: balanceResult.error,
          })
        );
      }

      const linkResult = derivePublicKeyFromAccount({ account: destinationResult.data, throwOnError: false });
      if (!linkResult.success) {
        return Result.err(
          new BlockError(
            BlockErrorCode.DerivePublicKeyFromDestinationFailed,
            "Failed to derive the destination public key.",
            {
              cause: linkResult.error,
            }
          )
        );
      }

      const block: StateBlock = {
        type: "state",
        account: frontierBlock.account,
        previous: previousResult.data,
        representative: representativeResult.data,
        balance: balanceResult.data,
        link: linkResult.data,
        link_as_account: destinationResult.data,
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
