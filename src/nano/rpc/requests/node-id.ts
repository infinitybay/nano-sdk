import { z } from "zod";

export function NodeIdRequest() {
  return z.object({
    action: z.literal("node_id"),
  });
}

export type NodeIdRequest = z.infer<ReturnType<typeof NodeIdRequest>>;
