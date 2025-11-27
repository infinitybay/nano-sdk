import { z } from "zod";

import { AccountString } from "../../types/account";

export function AccountGetResponse() {
  return z.object({
    account: AccountString(),
  });
}

export type AccountGetResponse = z.infer<ReturnType<typeof AccountGetResponse>>;
