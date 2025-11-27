import { z } from "zod";

import { BooleanString } from "../../types/boolean";
import { HashString } from "../../types/hash";

export function ReceivableExistsRequest() {
  return z.object({
    action: z.literal("receivable_exists"),
    hash: HashString(),
    include_active: BooleanString().or(z.boolean()).optional(),
    include_only_confirmed: BooleanString().or(z.boolean()).optional(),
  });
}

export type ReceivableExistsRequest = z.infer<ReturnType<typeof ReceivableExistsRequest>>;
