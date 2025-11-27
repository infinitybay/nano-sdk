import { z } from "zod";

import { AccountString } from "../types/account";
import { HashString } from "../types/hash";
import { SignatureString } from "../types/signature";
import { LegacyOpenTypeString } from "../types/type";
import { WorkString } from "../types/work";

export type LegacyOpenBlock = z.infer<ReturnType<typeof LegacyOpenBlock>>;
export const LegacyOpenBlock = () =>
  z.object({
    type: LegacyOpenTypeString(),
    source: HashString(),
    representative: AccountString(),
    account: AccountString(),
    work: WorkString(),
    signature: SignatureString(),
  });
