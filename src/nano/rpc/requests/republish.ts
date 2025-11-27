import { z } from "zod";

import { HashString } from "../../types/hash";
import { UInt, UIntString } from "../../types/uint";

export function RepublishRequest() {
  return z.object({
    action: z.literal("republish"),
    hash: HashString(),
    count: UIntString().or(UInt()).optional(),
    sources: UIntString().or(UInt()).optional(),
    destinations: UIntString().or(UInt()).optional(),
  });
}

export type RepublishRequest = z.infer<ReturnType<typeof RepublishRequest>>;
