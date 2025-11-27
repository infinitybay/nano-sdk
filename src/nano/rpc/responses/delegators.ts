import { z } from "zod";

import { AccountString } from "../../types/account";
import { RawAmountString } from "../../types/amount";

export function DelegatorsResponse() {
  return z.object({
    delegators: z.record(AccountString(), RawAmountString()).or(z.literal("")),
  });
}

export type DelegatorsResponse = z.infer<ReturnType<typeof DelegatorsResponse>>;
