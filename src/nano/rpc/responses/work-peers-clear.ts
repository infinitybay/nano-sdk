import { z } from "zod";

export function WorkPeersClearResponse() {
  return z.object({
    success: z.literal(""),
  });
}

export type WorkPeersClearResponse = z.infer<ReturnType<typeof WorkPeersClearResponse>>;
