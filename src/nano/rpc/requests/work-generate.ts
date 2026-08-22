import { z } from "zod";

import { StateBlock } from "../../blocks/state-block";
import { AccountString } from "../../types/account";
import { BooleanString } from "../../types/boolean";
import { HashString } from "../../types/hash";
import { NumberString } from "../../types/number";
import { WorkDifficultyString } from "../../types/work-difficulty";

export function WorkGenerateRequest() {
  return z.union([
    z.object({
      action: z.literal("work_generate"),
      hash: HashString(),
      json_block: z.literal(true),
      block: StateBlock().optional(),
      use_peers: BooleanString().or(z.boolean()).optional(),
      secondary_work_peers: BooleanString().or(z.boolean()).optional(),
      account: AccountString().optional(),
      version: z.literal("work_1").optional(),
      difficulty: WorkDifficultyString().optional(),
      multiplier: NumberString().optional(),
    }),
    z.object({
      action: z.literal("work_generate"),
      hash: HashString(),
      json_block: z.literal(false),
      block: z.string().optional(),
      use_peers: BooleanString().or(z.boolean()).optional(),
      secondary_work_peers: BooleanString().or(z.boolean()).optional(),
      account: AccountString().optional(),
      version: z.literal("work_1").optional(),
      difficulty: WorkDifficultyString().optional(),
      multiplier: NumberString().optional(),
    }),
    z.object({
      action: z.literal("work_generate"),
      hash: HashString(),
      json_block: BooleanString().or(z.boolean()).optional(),
      block: z.string().optional(),
      use_peers: BooleanString().or(z.boolean()).optional(),
      secondary_work_peers: BooleanString().or(z.boolean()).optional(),
      account: AccountString().optional(),
      version: z.literal("work_1").optional(),
      difficulty: WorkDifficultyString().optional(),
      multiplier: NumberString().optional(),
    }),
  ]);
}

export type WorkGenerateRequest = z.infer<ReturnType<typeof WorkGenerateRequest>>;
