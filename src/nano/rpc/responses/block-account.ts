import { z } from "zod";

import { AccountString } from "../../types/account";

export function BlockAccountResponse() {
  return z.object({
    account: AccountString(),
  });
}

export type BlockAccountResponse = z.infer<ReturnType<typeof BlockAccountResponse>>;
