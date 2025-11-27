import { z } from "zod";

import { PublicKeyString } from "../../types/public-key";

export function AccountGetRequest() {
  return z.object({
    action: z.literal("account_get"),
    key: PublicKeyString(),
  });
}

export type AccountGetRequest = z.infer<ReturnType<typeof AccountGetRequest>>;
