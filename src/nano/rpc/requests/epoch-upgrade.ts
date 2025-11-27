import { z } from "zod";

import { PrivateKeyString } from "../../types/private-key";
import { UInt, UIntString } from "../../types/uint";

export function EpochUpgradeRequest() {
  return z.object({
    action: z.literal("epoch_upgrade"),
    epoch: UIntString().or(UInt()),
    key: PrivateKeyString(),
    count: UIntString().or(UInt()).optional(),
    threads: UIntString().or(UInt()).optional(),
  });
}

export type EpochUpgradeRequest = z.infer<ReturnType<typeof EpochUpgradeRequest>>;
