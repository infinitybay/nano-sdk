import { z } from "zod";

export function WorkPeersResponse() {
  return z.object({
    work_peers: z.array(z.string()).or(z.literal("")),
  });
}

export type WorkPeersResponse = z.infer<ReturnType<typeof WorkPeersResponse>>;
