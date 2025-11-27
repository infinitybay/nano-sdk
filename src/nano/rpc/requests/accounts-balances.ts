import { z } from "zod";

import { AccountString } from "../../types/account";
import { BooleanString } from "../../types/boolean";

export function AccountsBalancesRequest() {
  return z.object({
    action: z.literal("accounts_balances"),
    accounts: AccountString().array(),
    include_only_confirmed: BooleanString().or(z.boolean()).optional(),
  });
}

export type AccountsBalancesRequest = z.infer<ReturnType<typeof AccountsBalancesRequest>>;
