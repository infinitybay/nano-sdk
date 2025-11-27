import { z } from "zod";

import { AccountString } from "../types/account";
import { RawAmountString } from "../types/amount";
import { HashString } from "../types/hash";
import { SignatureString } from "../types/signature";
import { LegacySendTypeString } from "../types/type";
import { WorkString } from "../types/work";

export type LegacySendBlock = z.infer<ReturnType<typeof LegacySendBlock>>;
export const LegacySendBlock = () =>
  z.object({
    type: LegacySendTypeString(),
    previous: HashString(),
    destination: AccountString(),
    balance: RawAmountString(),
    work: WorkString(),
    signature: SignatureString(),
  });
