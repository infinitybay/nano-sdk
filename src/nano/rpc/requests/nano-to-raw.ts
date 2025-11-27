import { z } from "zod";

import { NanoAmountString } from "../../types/amount";

export function NanoToRawRequest() {
  return z.object({
    action: z.literal("nano_to_raw"),
    amount: NanoAmountString(),
  });
}

export type NanoToRawRequest = z.infer<ReturnType<typeof NanoToRawRequest>>;
