import { z } from "zod";

import { AccountString } from "../../types/account";
import { HashString } from "../../types/hash";

export function FrontiersResponse() {
  return z.object({
    frontiers: z.record(AccountString(), HashString()),
  });
}

export type FrontiersResponse = z.infer<ReturnType<typeof FrontiersResponse>>;
