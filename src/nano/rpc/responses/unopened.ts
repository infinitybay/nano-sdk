import { z } from "zod";

import { AccountString } from "../../types/account";
import { RawAmountString } from "../../types/amount";

export function UnopenedResponse() {
  return z.object({
    accounts: z.record(AccountString(), RawAmountString()).or(z.literal("")),
  });
}

export type UnopenedResponse = z.infer<ReturnType<typeof UnopenedResponse>>;
