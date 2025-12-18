import { z } from "zod";

import { derivePublicKeyFromAccount } from "../crypto";
import { AccountString } from "../types/account";
import { RawAmountString } from "../types/amount";
import { HashString } from "../types/hash";
import { LinkString } from "../types/link";
import { SignatureString } from "../types/signature";
import { StateTypeString } from "../types/type";
import { WorkString } from "../types/work";

function isValidLink(link: LinkString, link_as_account: AccountString): boolean {
  const publicKeyResult = derivePublicKeyFromAccount({ account: link_as_account, throwOnError: false });
  if (publicKeyResult.success) {
    return publicKeyResult.data === link;
  }
  return false;
}

export type StateBlock = z.infer<ReturnType<typeof StateBlock>>;
export const StateBlock = () =>
  z
    .object({
      type: StateTypeString(),
      account: AccountString(),
      previous: HashString(),
      representative: AccountString(),
      balance: RawAmountString(),
      link: LinkString(),
      link_as_account: AccountString(),
      signature: SignatureString(),
      work: WorkString(),
    })
    .refine((val) => isValidLink(val.link, val.link_as_account), {
      message: "link must match the public key derived from link_as_account!",
    });
