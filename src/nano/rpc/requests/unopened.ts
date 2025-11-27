import { z } from "zod";

import { AccountString } from "../../types/account";
import { RawAmountString } from "../../types/amount";
import { UInt, UIntString } from "../../types/uint";

export function UnopenedRequest() {
  return z.object({
    action: z.literal("unopened"),
    account: AccountString().optional(),
    count: UIntString().or(UInt()).optional(),
    threshold: RawAmountString().optional(),
  });
}

export type UnopenedRequest = z.infer<ReturnType<typeof UnopenedRequest>>;
