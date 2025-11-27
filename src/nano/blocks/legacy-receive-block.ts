import { z } from "zod";

import { HashString } from "../types/hash";
import { SignatureString } from "../types/signature";
import { LegacyReceiveTypeString } from "../types/type";
import { WorkString } from "../types/work";

export type LegacyReceiveBlock = z.infer<ReturnType<typeof LegacyReceiveBlock>>;
export const LegacyReceiveBlock = () =>
  z.object({
    type: LegacyReceiveTypeString(),
    previous: HashString(),
    source: HashString(),
    work: WorkString(),
    signature: SignatureString(),
  });
