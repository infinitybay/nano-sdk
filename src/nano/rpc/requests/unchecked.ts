import { z } from "zod";

import { BooleanString } from "../../types/boolean";
import { UInt, UIntString } from "../../types/uint";

export function UncheckedRequest() {
  return z.object({
    action: z.literal("unchecked"),
    count: UIntString().or(UInt()).optional(),
    json_block: BooleanString().or(z.boolean()).optional(),
  });
}

export type UncheckedRequest = z.infer<ReturnType<typeof UncheckedRequest>>;
