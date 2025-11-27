import { z } from "zod";

import { AccountString } from "../types/account";
import { HashString } from "../types/hash";
import { SignatureString } from "../types/signature";
import { LegacyChangeTypeString } from "../types/type";
import { WorkString } from "../types/work";

export type LegacyChangeBlock = z.infer<ReturnType<typeof LegacyChangeBlock>>;
export const LegacyChangeBlock = () =>
  z.object({
    type: LegacyChangeTypeString(),
    previous: HashString(),
    representative: AccountString(),
    work: WorkString(),
    signature: SignatureString(),
  });
