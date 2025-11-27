import { z } from "zod";

import { BooleanString } from "../../types/boolean";

export function ConfirmationQuorumRequest() {
  return z.object({
    action: z.literal("confirmation_quorum"),
    peer_details: BooleanString().or(z.boolean()).optional(),
  });
}

export type ConfirmationQuorumRequest = z.infer<ReturnType<typeof ConfirmationQuorumRequest>>;
