import { z } from "zod";

export function WorkPeersRequest() {
  return z.object({
    action: z.literal("work_peers"),
  });
}

export type WorkPeersRequest = z.infer<ReturnType<typeof WorkPeersRequest>>;
