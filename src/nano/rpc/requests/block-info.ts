import { z } from "zod";

import { BooleanString } from "../../types/boolean";
import { HashString } from "../../types/hash";

export function BlockInfoRequest() {
  return z.object({
    action: z.literal("block_info"),
    hash: HashString(),
    include_linked_account: BooleanString().or(z.boolean()).optional(),
    json_block: BooleanString().or(z.boolean()).optional(),
  });
}

export type BlockInfoRequest = z.infer<ReturnType<typeof BlockInfoRequest>>;
