import { z } from "zod";

import { AccountString } from "../../types/account";
import { RawAmountString } from "../../types/amount";
import { BooleanString } from "../../types/boolean";
import { TimestampString } from "../../types/timestamp";
import { UInt, UIntString } from "../../types/uint";

export function LedgerRequest() {
  return z.object({
    action: z.literal("ledger"),
    account: AccountString().optional(),
    count: UIntString().or(UInt()).optional(),
    representative: BooleanString().or(z.boolean()).optional(),
    weight: BooleanString().or(z.boolean()).optional(),
    receivable: BooleanString().or(z.boolean()).optional(),
    modified_since: TimestampString().optional(),
    sorting: BooleanString().or(z.boolean()).optional(),
    threshold: RawAmountString().optional(),
  });
}

export type LedgerRequest = z.infer<ReturnType<typeof LedgerRequest>>;
