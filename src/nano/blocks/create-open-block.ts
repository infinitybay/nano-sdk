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
import { StateBlock } from "./state-block";

type CreateOpenBlockParams = {
  amount: RawAmount | RawAmountString;
  representative: AccountString;
  sendBlock: StateBlock;
  privateKey?: PrivateKeyString;
} & (Throwing | NonThrowing);

function createOpenBlockThrowing(params: CreateOpenBlockParams & Throwing): StateBlock {
  const sendBlockResult = StateBlock().safeParse(params.sendBlock);
  if (!sendBlockResult.success) {
    throw new Error("Invalid send state block.");
  }
  const sendBlock = sendBlockResult.data;

  const account = deriveAccountFromLink({ link: sendBlock.link, throwOnError: true });
  if (account !== sendBlock.link_as_account) {
    throw new Error("Send block link and link_as_account do not match.");
  }

  const amountResult = RawAmountString().safeParse(
    typeof params.amount === "bigint" ? params.amount.toString() : params.amount
  );
  if (!amountResult.success || amountResult.data === "0") {
    throw new Error("Invalid amount: expected a positive raw amount.");
  }
  const amount = amountResult.data;

  const representativeResult = AccountString().safeParse(params.representative);
  if (!representativeResult.success) {
    throw new Error("Invalid representative account.");
  }

  const sendBlockHash = hashBlock({ block: sendBlock, throwOnError: true });
  const block: StateBlock = {
    type: "state",
    account,
    previous: HashStrings.zero(),
    representative: representativeResult.data,
    balance: amount,
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

function createOpenBlockNonThrowing(params: CreateOpenBlockParams & NonThrowing): Result<StateBlock> {
  try {
    return {
      success: true,
      data: createOpenBlockThrowing({ ...params, throwOnError: true }),
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e : new Error("Unexpected error."),
    };
  }
}

export function createOpenBlock(params: CreateOpenBlockParams & NonThrowing): Result<StateBlock>;
export function createOpenBlock(params: CreateOpenBlockParams & Throwing): StateBlock;
export function createOpenBlock(params: CreateOpenBlockParams): StateBlock | Result<StateBlock>;
export function createOpenBlock(params: CreateOpenBlockParams) {
  if (params.throwOnError === false) {
    return createOpenBlockNonThrowing({ ...params, throwOnError: false });
  } else {
    return createOpenBlockThrowing({ ...params, throwOnError: true });
  }
}
