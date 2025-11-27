import { z } from "zod";

import { LegacyChangeBlock } from "./legacy-change-block";
import { LegacyOpenBlock } from "./legacy-open-block";
import { LegacyReceiveBlock } from "./legacy-receive-block";
import { LegacySendBlock } from "./legacy-send-block";
import { StateBlock } from "./state-block";

export type Block = z.infer<ReturnType<typeof Block>>;
export const Block = () =>
  z.union([LegacyChangeBlock(), LegacyOpenBlock(), LegacyReceiveBlock(), LegacySendBlock(), StateBlock()]);
