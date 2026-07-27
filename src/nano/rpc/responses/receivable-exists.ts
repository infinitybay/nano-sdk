import { z } from "zod";

import { BinaryBooleanString } from "../../types/binary-boolean-string";

export function ReceivableExistsResponse() {
  return z.object({
    exists: BinaryBooleanString(),
  });
}

export type ReceivableExistsResponse = z.infer<ReturnType<typeof ReceivableExistsResponse>>;
