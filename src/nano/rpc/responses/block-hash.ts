import { z } from "zod";

import { HashString } from "../../types/hash";

export function BlockHashResponse() {
  return z.object({
    hash: HashString(),
  });
}

export type BlockHashResponse = z.infer<ReturnType<typeof BlockHashResponse>>;
