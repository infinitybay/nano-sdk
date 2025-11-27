import { z } from "zod";

import { AccountString } from "../../types/account";

export function AccountsFrontiersRequest() {
  return z.object({
    action: z.literal("accounts_frontiers"),
    accounts: AccountString().array(),
  });
}

export type AccountsFrontiersRequest = z.infer<ReturnType<typeof AccountsFrontiersRequest>>;
