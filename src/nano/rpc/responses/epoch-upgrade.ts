import { z } from "zod";

export function EpochUpgradeResponse() {
  return z.object({
    started: z.literal("1").or(z.literal("0")),
  });
}

export type EpochUpgradeResponse = z.infer<ReturnType<typeof EpochUpgradeResponse>>;
