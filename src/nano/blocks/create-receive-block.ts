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
import { StateBlock } from "./state-block";

type CreateReceiveBlockParams = {
  amount: RawAmount | RawAmountString;
  frontierBlock: StateBlock;
  sendBlock: StateBlock;
  privateKey?: PrivateKeyString;
  representative?: AccountString;
} & (Throwing | NonThrowing);

function createReceiveBlockThrowing(params: CreateReceiveBlockParams & Throwing): StateBlock {
  const frontierBlockResult = StateBlock().safeParse(params.frontierBlock);
  if (!frontierBlockResult.success) {
    throw new Error("Invalid frontier state block.");
  }
  const frontierBlock = frontierBlockResult.data;

  const frontierLinkAsAccount = deriveAccountFromLink({ link: frontierBlock.link, throwOnError: true });
  if (frontierLinkAsAccount !== frontierBlock.link_as_account) {
    throw new Error("Frontier block link and link_as_account do not match.");
  }

  if (
    (typeof params.amount === "bigint" && params.amount < 0n) ||
    (typeof params.amount === "string" && params.amount.startsWith("-"))
  ) {
    throw new Error("Invalid amount: negative raw amounts are not allowed.");
  }

  const amountResult = RawAmountString().safeParse(
    typeof params.amount === "bigint" ? params.amount.toString() : params.amount
  );
  if (!amountResult.success || amountResult.data === "0") {
    throw new Error("Invalid amount: expected a positive raw amount.");
  }
  const amount = amountResult.data;

  const sendBlockResult = StateBlock().safeParse(params.sendBlock);
  if (!sendBlockResult.success) {
    throw new Error("Invalid send state block.");
  }
  const sendBlock = sendBlockResult.data;

  const destination = deriveAccountFromLink({ link: sendBlock.link, throwOnError: true });
  if (destination !== sendBlock.link_as_account) {
    throw new Error("Send block link and link_as_account do not match.");
  }
  if (destination !== frontierBlock.account) {
    throw new Error("Send block destination does not match the receiving account.");
  }
  const sendBlockHash = hashBlock({ block: sendBlock, throwOnError: true });

  const representativeResult = AccountString().safeParse(params.representative ?? frontierBlock.representative);
  if (!representativeResult.success) {
    throw new Error("Invalid representative account.");
  }

  const block: StateBlock = {
    type: "state",
    account: frontierBlock.account,
    previous: hashBlock({ block: frontierBlock, throwOnError: true }),
    representative: representativeResult.data,
    balance: rawPlus({ raw: frontierBlock.balance, addend: amount, throwOnError: true }),
    link: sendBlockHash,
    link_as_account: deriveAccountFromLink({ link: sendBlockHash, throwOnError: true }),
    signature: SignatureStrings.zero(),
    work: WorkStrings.zero(),
  };

  if (params.privateKey !== undefined) {
    block.signature = signBlock({
      block,
      privateKey: params.privateKey,
      throwOnError: true,
    });
  }

  const blockResult = StateBlock().safeParse(block);
  if (!blockResult.success) {
    throw new Error("Failed to create a valid state block.");
  }

  return block;
}

function createReceiveBlockNonThrowing(params: CreateReceiveBlockParams & NonThrowing): Result<StateBlock> {
  try {
    return {
      success: true,
      data: createReceiveBlockThrowing({ ...params, throwOnError: true }),
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e : new Error("Unexpected error."),
    };
  }
}

export function createReceiveBlock(params: CreateReceiveBlockParams & NonThrowing): Result<StateBlock>;
export function createReceiveBlock(params: CreateReceiveBlockParams & Throwing): StateBlock;
export function createReceiveBlock(params: CreateReceiveBlockParams): StateBlock | Result<StateBlock>;
export function createReceiveBlock(params: CreateReceiveBlockParams) {
  if (params.throwOnError === false) {
    return createReceiveBlockNonThrowing({ ...params, throwOnError: false });
  } else {
    return createReceiveBlockThrowing({ ...params, throwOnError: true });
  }
}
