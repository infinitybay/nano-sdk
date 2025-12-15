import { z } from "zod";

import { BinaryBooleanString } from "../../types";
import { NumberString } from "../../types/number";
import { WorkDifficultyString } from "../../types/work-difficulty";

export function WorkValidateResponse() {
  return z.object({
    valid: BinaryBooleanString().optional(),
    valid_all: BinaryBooleanString(),
    valid_receive: BinaryBooleanString(),
    difficulty: WorkDifficultyString(),
    multiplier: NumberString(),
  });
}

export type WorkValidateResponse = z.infer<ReturnType<typeof WorkValidateResponse>>;
