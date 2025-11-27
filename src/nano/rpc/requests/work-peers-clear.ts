import { z } from "zod";

export function WorkPeersClearRequest() {
  return z.object({
    action: z.literal("work_peers_clear"),
  });
}

export type WorkPeersClearRequest = z.infer<ReturnType<typeof WorkPeersClearRequest>>;
