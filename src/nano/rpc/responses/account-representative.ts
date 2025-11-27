import { z } from "zod";

import { AccountString } from "../../types/account";

export function AccountRepresentativeResponse() {
  return z.object({
    representative: AccountString(),
  });
}

export type AccountRepresentativeResponse = z.infer<ReturnType<typeof AccountRepresentativeResponse>>;
