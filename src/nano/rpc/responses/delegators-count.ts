import "../../../zod-extensions";

import { z } from "zod";

import { UIntString } from "../../types/uint";

export function DelegatorsCountResponse() {
  return z.object({
    count: UIntString().transformToUInt(),
  });
}

export type DelegatorsCountResponse = z.infer<ReturnType<typeof DelegatorsCountResponse>>;
