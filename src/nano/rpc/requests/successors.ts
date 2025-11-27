import { z } from "zod";

import { BooleanString } from "../../types/boolean";
import { HashString } from "../../types/hash";
import { UInt, UIntString } from "../../types/uint";

export function SuccessorsRequest() {
  return z.object({
    action: z.literal("successors"),
    block: HashString(),
    count: UIntString().or(UInt()),
    offset: UIntString().or(UInt()).optional(),
    reverse: BooleanString().or(z.boolean()).optional(),
  });
}

export type SuccessorsRequest = z.infer<ReturnType<typeof SuccessorsRequest>>;
