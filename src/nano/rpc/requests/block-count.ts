import { z } from "zod";

export function BlockCountRequest() {
  return z.object({
    action: z.literal("block_count"),
  });
}

export type BlockCountRequest = z.infer<ReturnType<typeof BlockCountRequest>>;
