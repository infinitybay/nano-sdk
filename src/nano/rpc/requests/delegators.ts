import { z } from "zod";

import { AccountString } from "../../types/account";
import { RawAmountString } from "../../types/amount";
import { UInt, UIntString } from "../../types/uint";

export function DelegatorsRequest() {
  return z.object({
    action: z.literal("delegators"),
    account: AccountString(),
    threshold: RawAmountString().optional(),
    start: AccountString().optional(),
    count: UIntString().or(UInt()).optional(),
  });
}

export type DelegatorsRequest = z.infer<ReturnType<typeof DelegatorsRequest>>;
