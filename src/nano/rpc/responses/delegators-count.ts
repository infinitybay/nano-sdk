import { z } from "zod";

import { UIntString } from "../../types/uint";

export function DelegatorsCountResponse() {
  return z.object({
    count: UIntString(),
  });
}

export type DelegatorsCountResponse = z.infer<ReturnType<typeof DelegatorsCountResponse>>;
