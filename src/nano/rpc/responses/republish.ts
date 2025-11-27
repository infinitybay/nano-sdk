import { z } from "zod";

import { HashString } from "../../types/hash";

export function RepublishResponse() {
  return z.object({
    success: z.literal(""),
    blocks: z.array(HashString()),
  });
}

export type RepublishResponse = z.infer<ReturnType<typeof RepublishResponse>>;
