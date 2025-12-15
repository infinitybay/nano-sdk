import { z } from "zod";

import { BinaryBooleanString } from "../../types/binary-boolean-string";

export function EpochUpgradeResponse() {
  return z.object({
    started: BinaryBooleanString(),
  });
}

export type EpochUpgradeResponse = z.infer<ReturnType<typeof EpochUpgradeResponse>>;
