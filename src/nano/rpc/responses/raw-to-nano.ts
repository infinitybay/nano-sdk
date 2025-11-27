import { z } from "zod";

import { NanoAmountString } from "../../types/amount";

export function RawToNanoResponse() {
  return z.object({
    amount: NanoAmountString(),
  });
}

export type RawToNanoResponse = z.infer<ReturnType<typeof RawToNanoResponse>>;
