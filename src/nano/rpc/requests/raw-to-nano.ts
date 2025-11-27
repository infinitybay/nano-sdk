import { z } from "zod";

import { RawAmountString } from "../../types/amount";

export function RawToNanoRequest() {
  return z.object({
    action: z.literal("raw_to_nano"),
    amount: RawAmountString(),
  });
}

export type RawToNanoRequest = z.infer<ReturnType<typeof RawToNanoRequest>>;
