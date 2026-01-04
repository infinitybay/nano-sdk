import { StateBlock } from "../blocks/state-block";
import { NonThrowing } from "../types/non-throwing";
import { PublicKeyString } from "../types/public-key";
import { PredicateResult } from "../types/result";
import { Throwing } from "../types/throwing";
import { derivePublicKeyFromAccount } from "./derive-public-key-from-account";
import { hashBlock } from "./hash-block";
import { verifySignature } from "./verify-signature";

type VerifyBlockParams = {
  block: StateBlock;
  publicKey?: PublicKeyString;
} & (Throwing | NonThrowing);

function verifyBlockThrowing(params: VerifyBlockParams & Throwing): boolean {
  if (params.block.link !== derivePublicKeyFromAccount({ account: params.block.link_as_account })) {
    return false;
  }
  return verifySignature({
    hash: hashBlock(params.block),
    publicKey: params.publicKey ?? derivePublicKeyFromAccount({ account: params.block.account }),
    signature: params.block.signature,
  });
}

function verifyBlockNonThrowing(params: VerifyBlockParams & NonThrowing): PredicateResult<"checked", "validBlock"> {
  try {
    return {
      checked: true,
      validBlock: verifyBlockThrowing({ ...params, throwOnError: true }),
    };
  } catch (e) {
    return {
      checked: false,
      error: e instanceof Error ? e : new Error("Unexpected error."),
    };
  }
}

export function verifyBlock(params: VerifyBlockParams & NonThrowing): PredicateResult<"checked", "validBlock">;
export function verifyBlock(params: VerifyBlockParams & Throwing): boolean;
export function verifyBlock(params: VerifyBlockParams): PredicateResult<"checked", "validBlock"> | boolean;
export function verifyBlock(params: VerifyBlockParams) {
  if (params.throwOnError === false) {
    return verifyBlockNonThrowing({ ...params, throwOnError: false });
  } else {
    return verifyBlockThrowing({ ...params, throwOnError: true });
  }
}
