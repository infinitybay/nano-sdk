import { z } from "zod";

import { BooleanString } from "../../types/boolean";
import { HashString } from "../../types/hash";

export function BlocksInfoRequest() {
  return z.object({
    action: z.literal("blocks_info"),
    hashes: HashString().array(),
    include_linked_account: BooleanString().or(z.boolean()).optional(),
    include_not_found: BooleanString().or(z.boolean()).optional(),
    json_block: BooleanString().or(z.boolean()).optional(),
    receivable: BooleanString().or(z.boolean()).optional(),
    receive_hash: BooleanString().or(z.boolean()).optional(),
    source: BooleanString().or(z.boolean()).optional(),
  });
}

export type BlocksInfoRequest = z.infer<ReturnType<typeof BlocksInfoRequest>>;
