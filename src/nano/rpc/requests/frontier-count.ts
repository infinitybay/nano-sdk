import { z } from "zod";

export function FrontierCountRequest() {
  return z.object({
    action: z.literal("frontier_count"),
  });
}

export type FrontierCountRequest = z.infer<ReturnType<typeof FrontierCountRequest>>;
