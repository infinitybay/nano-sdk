import { z } from "zod";

import { AccountString } from "../../types/account";

export function AccountsRepresentativesResponse() {
  return z.object({
    representatives: z.record(AccountString(), AccountString()).optional(),
    errors: z.record(AccountString(), z.string()).optional(),
  });
}

export type AccountsRepresentativesResponse = z.infer<ReturnType<typeof AccountsRepresentativesResponse>>;
