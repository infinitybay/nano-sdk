import { z } from "zod";

import { AccountString } from "../../types/account";

export function AccountBlockCountRequest() {
  return z.object({
    action: z.literal("account_block_count"),
    account: AccountString(),
  });
}

export type AccountBlockCountRequest = z.infer<ReturnType<typeof AccountBlockCountRequest>>;
