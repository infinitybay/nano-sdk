import { z } from "zod";

import { UIntString } from "../../types/uint";

export function AccountBlockCountResponse() {
  return z.object({
    block_count: UIntString(),
  });
}

export type AccountBlockCountResponse = z.infer<ReturnType<typeof AccountBlockCountResponse>>;
