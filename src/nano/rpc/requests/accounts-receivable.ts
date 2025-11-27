import { z } from "zod";

import { AccountString } from "../../types/account";
import { RawAmountString } from "../../types/amount";
import { BooleanString } from "../../types/boolean";
import { UInt, UIntString } from "../../types/uint";

export function AccountsReceivableRequest() {
  return z.object({
    action: z.literal("accounts_receivable"),
    accounts: AccountString().array(),
    count: UIntString().or(UInt()).optional(),
    threshold: RawAmountString().optional(),
    source: BooleanString().or(z.boolean()).optional(),
    include_active: BooleanString().or(z.boolean()).optional(),
    include_only_confirmed: BooleanString().or(z.boolean()).optional(),
    sorting: BooleanString().or(z.boolean()).optional(),
  });
}

export type AccountsReceivableRequest = z.infer<ReturnType<typeof AccountsReceivableRequest>>;
