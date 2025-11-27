import { z } from "zod";

import { RawAmountString } from "../../types/amount";

export function NanoToRawResponse() {
  return z.object({
    amount: RawAmountString(),
  });
}

export type NanoToRawResponse = z.infer<ReturnType<typeof NanoToRawResponse>>;
