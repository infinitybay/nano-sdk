import { z } from "zod";

import { AccountString } from "../../types/account";
import { HashString } from "../../types/hash";

export function AccountsFrontiersResponse() {
  return z.object({
    frontiers: z.record(AccountString(), HashString()).optional(),
    errors: z.record(AccountString(), z.string()).optional(),
  });
}

export type AccountsFrontiersResponse = z.infer<ReturnType<typeof AccountsFrontiersResponse>>;
