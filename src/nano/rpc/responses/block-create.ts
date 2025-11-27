import { z } from "zod";

import { StateBlock } from "../../blocks/state-block";
import { BooleanDistribution } from "../../types/boolean-distribution";
import { HashString } from "../../types/hash";
import { UppercaseKeys } from "../../types/uppercase-keys";
import { WorkDifficultyString } from "../../types/work-difficulty";

type BlockCreateResponseOptions = {
  json_block: boolean;
};

type BlockCreateResponseZodType<T extends UppercaseKeys<BlockCreateResponseOptions>> = BooleanDistribution<
  T["JSON_BLOCK"],
  z.ZodObject<{
    hash: ReturnType<typeof HashString>;
    difficulty: ReturnType<typeof WorkDifficultyString>;
    block: ReturnType<typeof StateBlock>;
  }>,
  z.ZodObject<{
    hash: ReturnType<typeof HashString>;
    difficulty: ReturnType<typeof WorkDifficultyString>;
    block: z.ZodString;
  }>
>;

export type BlockCreateResponse<T extends UppercaseKeys<BlockCreateResponseOptions>> = z.infer<
  BlockCreateResponseZodType<T>
>;

export function BlockCreateResponse<T extends BlockCreateResponseOptions>(
  options: T
): BlockCreateResponseZodType<UppercaseKeys<T>>;
export function BlockCreateResponse(options: BlockCreateResponseOptions) {
  return options.json_block
    ? z.object({
        hash: HashString(),
        difficulty: WorkDifficultyString(),
        block: StateBlock(),
      })
    : z.object({
        hash: HashString(),
        difficulty: WorkDifficultyString(),
        block: z.string(),
      });
}
