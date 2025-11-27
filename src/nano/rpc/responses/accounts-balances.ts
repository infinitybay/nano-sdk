import { z } from "zod";

import { AccountString } from "../../types/account";
import { RawAmountString } from "../../types/amount";

const AccountBalanceTotals = () =>
  z.object({
    balance: RawAmountString(),
    pending: RawAmountString(),
    receivable: RawAmountString(),
  });

export function AccountsBalancesResponse() {
  return z.object({
    balances: z.record(AccountString(), AccountBalanceTotals()).optional(),
    errors: z.record(AccountString(), z.string()).optional(),
  });
}

export type AccountsBalancesResponse = z.infer<ReturnType<typeof AccountsBalancesResponse>>;
