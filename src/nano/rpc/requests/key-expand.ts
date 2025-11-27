import { z } from "zod";

import { PrivateKeyString } from "../../types/private-key";

export function KeyExpandRequest() {
  return z.object({
    action: z.literal("key_expand"),
    key: PrivateKeyString(),
  });
}

export type KeyExpandRequest = z.infer<ReturnType<typeof KeyExpandRequest>>;
