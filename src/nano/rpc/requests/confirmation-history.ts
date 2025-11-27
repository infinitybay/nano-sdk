import { z } from "zod";

import { HashString } from "../../types/hash";

export function ConfirmationHistoryRequest() {
  return z.object({
    action: z.literal("confirmation_history"),
    hash: HashString().optional(),
  });
}

export type ConfirmationHistoryRequest = z.infer<ReturnType<typeof ConfirmationHistoryRequest>>;
