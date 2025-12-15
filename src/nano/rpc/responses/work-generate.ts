import { z } from "zod";

import { HashString } from "../../types/hash";
import { NumberString } from "../../types/number";
import { WorkString } from "../../types/work";
import { WorkDifficultyString } from "../../types/work-difficulty";

export function WorkGenerateResponse() {
  return z.object({
    hash: HashString(),
    work: WorkString(),
    difficulty: WorkDifficultyString(),
    multiplier: NumberString(),
  });
}

export type WorkGenerateResponse = z.infer<ReturnType<typeof WorkGenerateResponse>>;
