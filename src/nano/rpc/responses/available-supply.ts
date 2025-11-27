import { z } from "zod";

import { RawAmountString } from "../../types/amount";

export function AvailableSupplyResponse() {
  return z.object({
    available: RawAmountString(),
  });
}

export type AvailableSupplyResponse = z.infer<ReturnType<typeof AvailableSupplyResponse>>;
