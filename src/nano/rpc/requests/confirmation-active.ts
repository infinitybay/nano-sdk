import { z } from "zod";

import { UInt, UIntString } from "../../types/uint";

export function ConfirmationActiveRequest() {
  return z.object({
    action: z.literal("confirmation_active"),
    announcements: UIntString().or(UInt()).optional(),
  });
}

export type ConfirmationActiveRequest = z.infer<ReturnType<typeof ConfirmationActiveRequest>>;
