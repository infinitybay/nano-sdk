import { z } from "zod";

import { BooleanString } from "../../types/boolean";
import { HashString } from "../../types/hash";

export function BlocksRequest() {
  return z.object({
    action: z.literal("blocks"),
    hashes: HashString().array(),
    json_block: BooleanString().or(z.boolean()).optional(),
  });
}

export type BlocksRequest = z.infer<ReturnType<typeof BlocksRequest>>;
