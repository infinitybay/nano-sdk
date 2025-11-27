import { z } from "zod";

import { AccountString } from "../../types/account";
import { BooleanString } from "../../types/boolean";

export function AccountInfoRequest() {
  return z.object({
    action: z.literal("account_info"),
    account: AccountString(),
    representative: BooleanString().or(z.boolean()).optional(),
    weight: BooleanString().or(z.boolean()).optional(),
    receivable: BooleanString().or(z.boolean()).optional(),
    include_confirmed: BooleanString().or(z.boolean()).optional(),
  });
}

export type AccountInfoRequest = z.infer<ReturnType<typeof AccountInfoRequest>>;
