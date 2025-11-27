import { z } from "zod";

import { AccountString } from "../../types/account";

export function AccountKeyRequest() {
  return z.object({
    action: z.literal("account_key"),
    account: AccountString(),
  });
}

export type AccountKeyRequest = z.infer<ReturnType<typeof AccountKeyRequest>>;
