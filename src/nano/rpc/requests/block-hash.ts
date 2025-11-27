import { z } from "zod";

import { StateBlock } from "../../blocks/state-block";

export function BlockHashRequest() {
  return z.union([
    z.object({
      action: z.literal("block_hash"),
      json_block: z.literal(true),
      block: StateBlock(),
    }),
    z.object({
      action: z.literal("block_hash"),
      json_block: z.literal(false),
      block: z.string(),
    }),
  ]);
}

export type BlockHashRequest = z.infer<ReturnType<typeof BlockHashRequest>>;
