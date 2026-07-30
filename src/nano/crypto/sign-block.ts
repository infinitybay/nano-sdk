import { StateBlock } from "../blocks/state-block";
import { NonThrowing } from "../types/non-throwing";
import { PrivateKeyString } from "../types/private-key";
import { Result } from "../types/result";
import { SignatureString } from "../types/signature";
import { Throwing } from "../types/throwing";
import { deriveAccountFromLink } from "./derive-account-from-link";
import { deriveAccountFromPrivateKey } from "./derive-account-from-private-key";
import { hashBlock } from "./hash-block";
import { signHash } from "./sign-hash";

type SignBlockParams = {
  block: StateBlock;
  privateKey: PrivateKeyString;
} & (Throwing | NonThrowing);

function signBlockThrowing(params: SignBlockParams & Throwing): SignatureString {
  const blockResult = StateBlock().safeParse(params.block);
  if (!blockResult.success) {
    throw new Error("Invalid state block.");
  }

  const block = blockResult.data;
  const account = deriveAccountFromPrivateKey({ privateKey: params.privateKey, throwOnError: true });
  if (account !== block.account) {
    throw new Error("Private key does not belong to the block account.");
  }

  const linkAsAccount = deriveAccountFromLink({ link: block.link, throwOnError: true });
  if (linkAsAccount !== block.link_as_account) {
    throw new Error("Block link and link_as_account do not match.");
  }

  return signHash({
    hash: hashBlock({ block, throwOnError: true }),
    privateKey: params.privateKey,
    throwOnError: true,
  });
}

function signBlockNonThrowing(params: SignBlockParams & NonThrowing): Result<SignatureString> {
  try {
    return {
      success: true,
      data: signBlockThrowing({ ...params, throwOnError: true }),
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e : new Error("Unexpected error."),
    };
  }
}

export function signBlock(params: SignBlockParams & NonThrowing): Result<SignatureString>;
export function signBlock(params: SignBlockParams & Throwing): SignatureString;
export function signBlock(params: SignBlockParams): SignatureString | Result<SignatureString>;
export function signBlock(params: SignBlockParams) {
  if (params.throwOnError === false) {
    return signBlockNonThrowing({ ...params, throwOnError: false });
  } else {
    return signBlockThrowing({ ...params, throwOnError: true });
  }
}
