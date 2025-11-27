import { z } from "zod";

import { HashString } from "../../types/hash";

export function BlockAccountRequest() {
  return z.object({
    action: z.literal("block_account"),
    hash: HashString(),
  });
}

export type BlockAccountRequest = z.infer<ReturnType<typeof BlockAccountRequest>>;
