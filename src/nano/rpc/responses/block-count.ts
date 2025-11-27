import "../../../zod-extensions";

import { z } from "zod";

import { UIntString } from "../../types/uint";

export function BlockCountResponse() {
  return z.object({
    count: UIntString().transformToUInt(),
    unchecked: UIntString().transformToUInt(),
    cemented: UIntString().transformToUInt(),
  });
}

export type BlockCountResponse = z.infer<ReturnType<typeof BlockCountResponse>>;
