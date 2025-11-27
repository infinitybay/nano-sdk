import { z } from "zod";

import { AccountString } from "../../types/account";

export function AccountWeightRequest() {
  return z.object({
    action: z.literal("account_weight"),
    account: AccountString(),
  });
}

export type AccountWeightRequest = z.infer<ReturnType<typeof AccountWeightRequest>>;
