import { z } from "zod";

import { HashString } from "../../types/hash";

export function ChainResponse() {
  return z.object({
    blocks: z.union([HashString().array(), z.literal("")]),
  });
}

export type ChainResponse = z.infer<ReturnType<typeof ChainResponse>>;
