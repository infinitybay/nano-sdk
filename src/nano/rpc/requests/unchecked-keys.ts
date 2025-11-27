import { z } from "zod";

import { BooleanString } from "../../types/boolean";
import { HashString } from "../../types/hash";
import { UInt, UIntString } from "../../types/uint";

export function UncheckedKeysRequest() {
  return z.object({
    action: z.literal("unchecked_keys"),
    key: HashString().optional(),
    count: UIntString().or(UInt()),
    json_block: BooleanString().or(z.boolean()).optional(),
  });
}

export type UncheckedKeysRequest = z.infer<ReturnType<typeof UncheckedKeysRequest>>;
