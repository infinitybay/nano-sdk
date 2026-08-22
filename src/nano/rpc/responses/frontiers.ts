import { z } from "zod";

import { AccountString } from "../../types/account";
import { HashString } from "../../types/hash";

export function FrontiersResponse() {
  return z.object({
    frontiers: z.union([z.record(AccountString(), HashString()), z.literal("")]),
  });
}

export type FrontiersResponse = z.infer<ReturnType<typeof FrontiersResponse>>;
