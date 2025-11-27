import { z } from "zod";

import { SeedIndex, SeedString } from "../../types/seed";

export function DeterministicKeyRequest() {
  return z.object({
    action: z.literal("deterministic_key"),
    seed: SeedString(),
    index: SeedIndex(),
  });
}

export type DeterministicKeyRequest = z.infer<ReturnType<typeof DeterministicKeyRequest>>;
