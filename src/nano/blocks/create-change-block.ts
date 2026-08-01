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
import { StateBlock } from "./state-block";

type CreateChangeBlockParams = {
  frontierBlock: StateBlock;
  representative: AccountString;
  privateKey?: PrivateKeyString;
} & (Throwing | NonThrowing);

function createChangeBlockThrowing(params: CreateChangeBlockParams & Throwing): StateBlock {
  const frontierBlockResult = StateBlock().safeParse(params.frontierBlock);
  if (!frontierBlockResult.success) {
    throw new Error("Invalid frontier state block.");
  }
  const frontierBlock = frontierBlockResult.data;

  const frontierLinkAsAccount = deriveAccountFromLink({ link: frontierBlock.link, throwOnError: true });
  if (frontierLinkAsAccount !== frontierBlock.link_as_account) {
    throw new Error("Frontier block link and link_as_account do not match.");
  }

  const representativeResult = AccountString().safeParse(params.representative);
  if (!representativeResult.success) {
    throw new Error("Invalid representative account.");
  }

  const link = HashStrings.zero();
  const block: StateBlock = {
    type: "state",
    account: frontierBlock.account,
    previous: hashBlock({ block: frontierBlock, throwOnError: true }),
    representative: representativeResult.data,
    balance: frontierBlock.balance,
    link,
    link_as_account: deriveAccountFromLink({ link, throwOnError: true }),
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

function createChangeBlockNonThrowing(params: CreateChangeBlockParams & NonThrowing): Result<StateBlock> {
  try {
    return {
      success: true,
      data: createChangeBlockThrowing({ ...params, throwOnError: true }),
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e : new Error("Unexpected error."),
    };
  }
}

export function createChangeBlock(params: CreateChangeBlockParams & NonThrowing): Result<StateBlock>;
export function createChangeBlock(params: CreateChangeBlockParams & Throwing): StateBlock;
export function createChangeBlock(params: CreateChangeBlockParams): StateBlock | Result<StateBlock>;
export function createChangeBlock(params: CreateChangeBlockParams) {
  if (params.throwOnError === false) {
    return createChangeBlockNonThrowing({ ...params, throwOnError: false });
  } else {
    return createChangeBlockThrowing({ ...params, throwOnError: true });
  }
}
