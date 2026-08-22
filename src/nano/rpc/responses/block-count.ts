import { z } from "zod";

import { UIntString } from "../../types/uint";

export function BlockCountResponse() {
  return z.object({
    count: UIntString(),
    unchecked: UIntString(),
    cemented: UIntString(),
    full: UIntString().optional(),
    pruned: UIntString().optional(),
  });
}

export type BlockCountResponse = z.infer<ReturnType<typeof BlockCountResponse>>;
