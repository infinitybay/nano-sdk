import { z } from "zod";

import { AccountString } from "../../types/account";
import { RawAmountString } from "../../types/amount";
import { BooleanString } from "../../types/boolean";
import { UInt, UIntString } from "../../types/uint";

export function ReceivableRequest() {
  return z.object({
    action: z.literal("receivable"),
    account: AccountString(),
    count: UIntString().or(UInt()).optional(),
    offset: UIntString().or(UInt()).optional(),
    threshold: z.union([z.literal(""), z.literal("0"), RawAmountString()]).optional(),
    source: BooleanString().or(z.boolean()).optional(),
    include_active: BooleanString().or(z.boolean()).optional(),
    include_only_confirmed: BooleanString().or(z.boolean()).optional(),
    min_version: BooleanString().or(z.boolean()).optional(),
    sorting: BooleanString().or(z.boolean()).optional(),
  });
}

export type ReceivableRequest = z.infer<ReturnType<typeof ReceivableRequest>>;
