import { z } from "zod";

import { AccountString } from "../../types/account";

export function AccountRepresentativeRequest() {
  return z.object({
    action: z.literal("account_representative"),
    account: AccountString(),
  });
}

export type AccountRepresentativeRequest = z.infer<ReturnType<typeof AccountRepresentativeRequest>>;
