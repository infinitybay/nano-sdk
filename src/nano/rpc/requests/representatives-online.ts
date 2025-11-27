import { z } from "zod";

import { AccountString } from "../../types/account";
import { BooleanString } from "../../types/boolean";

export function RepresentativesOnlineRequest() {
  return z.object({
    action: z.literal("representatives_online"),
    accounts: AccountString().array().optional(),
    weight: BooleanString().or(z.boolean()).optional(),
  });
}

export type RepresentativesOnlineRequest = z.infer<ReturnType<typeof RepresentativesOnlineRequest>>;
