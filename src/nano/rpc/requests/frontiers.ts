import { z } from "zod";

import { AccountString } from "../../types/account";
import { UInt, UIntString } from "../../types/uint";

export function FrontiersRequest() {
  return z.object({
    action: z.literal("frontiers"),
    account: AccountString(),
    count: UIntString().or(UInt()),
  });
}

export type FrontiersRequest = z.infer<ReturnType<typeof FrontiersRequest>>;
