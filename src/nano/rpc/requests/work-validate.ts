import { z } from "zod";

import { HashString } from "../../types/hash";
import { WorkString } from "../../types/work";

export function WorkValidateRequest() {
  return z.object({
    action: z.literal("work_validate"),
    work: WorkString(),
    hash: HashString(),
    version: z.literal("work_1").optional(),
  });
}

export type WorkValidateRequest = z.infer<ReturnType<typeof WorkValidateRequest>>;
