import { z } from "zod";

import { HashString } from "../../types/hash";

export function BlockConfirmRequest() {
  return z.object({
    action: z.literal("block_confirm"),
    hash: HashString(),
  });
}

export type BlockConfirmRequest = z.infer<ReturnType<typeof BlockConfirmRequest>>;
