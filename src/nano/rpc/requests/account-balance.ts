import { z } from "zod";

import { AccountString } from "../../types/account";
import { BooleanString } from "../../types/boolean";

export function AccountBalanceRequest() {
  return z.object({
    action: z.literal("account_balance"),
    account: AccountString(),
    include_only_confirmed: BooleanString().or(z.boolean()).optional(),
  });
}

export type AccountBalanceRequest = z.infer<ReturnType<typeof AccountBalanceRequest>>;
