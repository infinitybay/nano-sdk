import { z } from "zod";

import { AccountString } from "../../types/account";
import { RawAmountString } from "../../types/amount";

export function RepresentativesResponse() {
  return z.object({
    representatives: z.record(AccountString(), RawAmountString()).or(z.literal("")),
  });
}

export type RepresentativesResponse = z.infer<ReturnType<typeof RepresentativesResponse>>;
