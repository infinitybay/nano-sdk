import { z } from "zod";

import { BooleanString } from "../../types/boolean";
import { HashString } from "../../types/hash";
import { UInt, UIntString } from "../../types/uint";

export function ChainRequest() {
  return z.object({
    action: z.literal("chain"),
    block: HashString(),
    count: UIntString().or(UInt()),
    offset: UIntString().or(UInt()).optional(),
    reverse: BooleanString().or(z.boolean()).optional(),
  });
}

export type ChainRequest = z.infer<ReturnType<typeof ChainRequest>>;
