import "../../../zod-extensions";

import { z } from "zod";

import { RootString } from "../../types/root";
import { UIntString } from "../../types/uint";

export function ConfirmationActiveResponse() {
  return z.object({
    confirmations: z.array(RootString()).or(z.literal("")),
    unconfirmed: UIntString().transformToUInt(),
    confirmed: UIntString().transformToUInt(),
  });
}

export type ConfirmationActiveResponse = z.infer<ReturnType<typeof ConfirmationActiveResponse>>;
