import { z } from "zod";

import { AccountString } from "../../types/account";
import { BooleanString } from "../../types/boolean";
import { HashString } from "../../types/hash";
import { UInt, UIntString } from "../../types/uint";

export function AccountHistoryRequest() {
  return z
    .object({
      action: z.literal("account_history"),
      account: AccountString(),
      account_filter: AccountString().array().optional(),
      count: UIntString().or(UInt()),
      head: z.never().optional(),
      include_linked_account: BooleanString().or(z.boolean()).optional(),
      offset: UIntString().or(UInt()).optional(),
      raw: BooleanString().or(z.boolean()).optional(),
      reverse: BooleanString().or(z.boolean()).optional(),
    })
    .or(
      z.object({
        action: z.literal("account_history"),
        account: z.never().optional(),
        account_filter: AccountString().array().optional(),
        count: UIntString().or(UInt()),
        head: HashString(),
        include_linked_account: BooleanString().or(z.boolean()).optional(),
        offset: UIntString().or(UInt()).optional(),
        raw: BooleanString().or(z.boolean()).optional(),
        reverse: BooleanString().or(z.boolean()).optional(),
      })
    );
}

export type AccountHistoryRequest = z.infer<ReturnType<typeof AccountHistoryRequest>>;
