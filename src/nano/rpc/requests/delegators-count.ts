import { z } from "zod";

import { AccountString } from "../../types/account";

export function DelegatorsCountRequest() {
  return z.object({
    action: z.literal("delegators_count"),
    account: AccountString(),
  });
}

export type DelegatorsCountRequest = z.infer<ReturnType<typeof DelegatorsCountRequest>>;
