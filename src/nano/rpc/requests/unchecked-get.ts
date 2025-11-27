import { z } from "zod";

import { BooleanString } from "../../types/boolean";
import { HashString } from "../../types/hash";

export function UncheckedGetRequest() {
  return z.object({
    action: z.literal("unchecked_get"),
    hash: HashString(),
    json_block: BooleanString().or(z.boolean()).optional(),
  });
}

export type UncheckedGetRequest = z.infer<ReturnType<typeof UncheckedGetRequest>>;
