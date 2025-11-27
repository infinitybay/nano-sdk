import { z } from "zod";

import { BooleanString } from "../../types/boolean";
import { UInt, UIntString } from "../../types/uint";

export function RepresentativesRequest() {
  return z.object({
    action: z.literal("representatives"),
    count: UIntString().or(UInt()).optional(),
    sorting: BooleanString().or(z.boolean()).optional(),
  });
}

export type RepresentativesRequest = z.infer<ReturnType<typeof RepresentativesRequest>>;
