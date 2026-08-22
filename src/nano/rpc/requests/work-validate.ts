import { z } from "zod";

import { HashString } from "../../types/hash";
import { NumberString } from "../../types/number";
import { WorkString } from "../../types/work";
import { WorkDifficultyString } from "../../types/work-difficulty";

export function WorkValidateRequest() {
  return z.object({
    action: z.literal("work_validate"),
    work: WorkString(),
    hash: HashString(),
    version: z.literal("work_1").optional(),
    difficulty: WorkDifficultyString().optional(),
    multiplier: NumberString().optional(),
  });
}

export type WorkValidateRequest = z.infer<ReturnType<typeof WorkValidateRequest>>;
