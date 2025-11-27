import { z } from "zod";

import { RawAmountString } from "../../types/amount";

export function AccountWeightResponse() {
  return z.object({
    weight: RawAmountString(),
  });
}

export type AccountWeightResponse = z.infer<ReturnType<typeof AccountWeightResponse>>;
