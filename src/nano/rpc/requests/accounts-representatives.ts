import { z } from "zod";

import { AccountString } from "../../types/account";

export function AccountsRepresentativesRequest() {
  return z.object({
    action: z.literal("accounts_representatives"),
    accounts: AccountString().array(),
  });
}

export type AccountsRepresentativesRequest = z.infer<ReturnType<typeof AccountsRepresentativesRequest>>;
