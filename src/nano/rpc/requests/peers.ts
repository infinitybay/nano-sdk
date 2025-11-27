import { z } from "zod";

import { BooleanString } from "../../types/boolean";

export function PeersRequest() {
  return z.object({
    action: z.literal("peers"),
    peer_details: BooleanString().or(z.boolean()).optional(),
  });
}

export type PeersRequest = z.infer<ReturnType<typeof PeersRequest>>;
