import { z } from "zod";

import { AccountString } from "../types/account";
import { RawAmountString } from "../types/amount";
import { HashString } from "../types/hash";
import { LinkString } from "../types/link";
import { SignatureString } from "../types/signature";
import { StateTypeString } from "../types/type";
import { WorkString } from "../types/work";

export type StateBlock = z.infer<ReturnType<typeof StateBlock>>;
export const StateBlock = () =>
  z.object({
    type: StateTypeString(),
    account: AccountString(),
    previous: HashString(),
    representative: AccountString(),
    balance: RawAmountString(),
    link: LinkString(),
    link_as_account: AccountString(),
    signature: SignatureString(),
    work: WorkString(),
  });
