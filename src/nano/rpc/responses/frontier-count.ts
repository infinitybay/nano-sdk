import "../../../zod-extensions";

import { z } from "zod";

import { UIntString } from "../../types/uint";

export function FrontierCountResponse() {
  return z.object({
    count: UIntString().transformToUInt(),
  });
}

export type FrontierCountResponse = z.infer<ReturnType<typeof FrontierCountResponse>>;
