import { z } from "zod";

import { RawAmountString } from "../../types/amount";

export function AccountBalanceResponse() {
  return z.object({
    balance: RawAmountString(),
    pending: RawAmountString(),
    receivable: RawAmountString(),
  });
}

export type AccountBalanceResponse = z.infer<ReturnType<typeof AccountBalanceResponse>>;
