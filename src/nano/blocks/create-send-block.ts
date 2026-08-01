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
import { StateBlock } from "./state-block";

type CreateSendBlockParams = {
  amount: RawAmount | RawAmountString;
  destination: AccountString;
  frontierBlock: StateBlock;
  privateKey?: PrivateKeyString;
  representative?: AccountString;
} & (Throwing | NonThrowing);

function createSendBlockThrowing(params: CreateSendBlockParams & Throwing): StateBlock {
  const frontierBlockResult = StateBlock().safeParse(params.frontierBlock);
  if (!frontierBlockResult.success) {
    throw new Error("Invalid frontier state block.");
  }
  const frontierBlock = frontierBlockResult.data;

  const frontierLinkAsAccount = deriveAccountFromLink({ link: frontierBlock.link, throwOnError: true });
  if (frontierLinkAsAccount !== frontierBlock.link_as_account) {
    throw new Error("Frontier block link and link_as_account do not match.");
  }

  const amountResult = RawAmountString().safeParse(
    typeof params.amount === "bigint" ? params.amount.toString() : params.amount
  );
  if (!amountResult.success || amountResult.data === "0") {
    throw new Error("Invalid amount: expected a positive raw amount.");
  }
  const amount = amountResult.data;

  const destinationResult = AccountString().safeParse(params.destination);
  if (!destinationResult.success) {
    throw new Error("Invalid destination account.");
  }

  const representativeResult = AccountString().safeParse(params.representative ?? frontierBlock.representative);
  if (!representativeResult.success) {
    throw new Error("Invalid representative account.");
  }

  const block: StateBlock = {
    type: "state",
    account: frontierBlock.account,
    previous: hashBlock({ block: frontierBlock, throwOnError: true }),
    representative: representativeResult.data,
    balance: rawMinus({ raw: frontierBlock.balance, subtrahend: amount, throwOnError: true }),
    link: derivePublicKeyFromAccount({ account: destinationResult.data, throwOnError: true }),
    link_as_account: destinationResult.data,
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

function createSendBlockNonThrowing(params: CreateSendBlockParams & NonThrowing): Result<StateBlock> {
  try {
    return {
      success: true,
      data: createSendBlockThrowing({ ...params, throwOnError: true }),
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e : new Error("Unexpected error."),
    };
  }
}

export function createSendBlock(params: CreateSendBlockParams & NonThrowing): Result<StateBlock>;
export function createSendBlock(params: CreateSendBlockParams & Throwing): StateBlock;
export function createSendBlock(params: CreateSendBlockParams): StateBlock | Result<StateBlock>;
export function createSendBlock(params: CreateSendBlockParams) {
  if (params.throwOnError === false) {
    return createSendBlockNonThrowing({ ...params, throwOnError: false });
  } else {
    return createSendBlockThrowing({ ...params, throwOnError: true });
  }
}
