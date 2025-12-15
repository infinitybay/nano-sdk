import { z } from "zod";

import { RootString } from "../../types/root";
import { UIntString } from "../../types/uint";

export function ConfirmationActiveResponse() {
  return z.object({
    confirmations: z.array(RootString()).or(z.literal("")),
    unconfirmed: UIntString(),
    confirmed: UIntString(),
  });
}

export type ConfirmationActiveResponse = z.infer<ReturnType<typeof ConfirmationActiveResponse>>;
