import "../../../zod-extensions";

import { z } from "zod";

import { UIntString } from "../../types/uint";

export function AccountBlockCountResponse() {
  return z.object({
    block_count: UIntString().transformToUInt(),
  });
}

export type AccountBlockCountResponse = z.infer<ReturnType<typeof AccountBlockCountResponse>>;
