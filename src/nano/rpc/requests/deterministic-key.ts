import { z } from "zod";

import { SeedIndex, SeedIndexString, SeedString } from "../../types/seed";

export function DeterministicKeyRequest() {
  return z.object({
    action: z.literal("deterministic_key"),
    seed: SeedString(),
    index: SeedIndexString().or(SeedIndex()),
  });
}

export type DeterministicKeyRequest = z.infer<ReturnType<typeof DeterministicKeyRequest>>;
