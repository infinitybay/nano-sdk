import { z } from "zod";

export function WorkPeerAddResponse() {
  return z.object({
    success: z.literal(""),
  });
}

export type WorkPeerAddResponse = z.infer<ReturnType<typeof WorkPeerAddResponse>>;
