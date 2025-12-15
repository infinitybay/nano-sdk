import { z } from "zod";

import { NumberString } from "../../types/number";
import { WorkDifficultyString } from "../../types/work-difficulty";

export function WorkValidateResponse() {
  return z.object({
    valid: z.literal("1").or(z.literal("0")).optional(),
    valid_all: z.literal("1").or(z.literal("0")),
    valid_receive: z.literal("1").or(z.literal("0")),
    difficulty: WorkDifficultyString(),
    multiplier: NumberString(),
  });
}

export type WorkValidateResponse = z.infer<ReturnType<typeof WorkValidateResponse>>;
