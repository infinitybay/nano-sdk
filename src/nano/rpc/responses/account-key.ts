import { z } from "zod";

import { PublicKeyString } from "../../types/public-key";

export function AccountKeyResponse() {
  return z.object({
    key: PublicKeyString(),
  });
}

export type AccountKeyResponse = z.infer<ReturnType<typeof AccountKeyResponse>>;
