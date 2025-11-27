import { z } from "zod";

import { Block } from "../../blocks/block";
import { BooleanDistribution } from "../../types/boolean-distribution";
import { HashString } from "../../types/hash";
import { UppercaseKeys } from "../../types/uppercase-keys";

type BlocksResponseOptions = {
  json_block: boolean;
};

type BlocksResponseZodType<T extends UppercaseKeys<BlocksResponseOptions>> = BooleanDistribution<
  T["JSON_BLOCK"],
  z.ZodObject<{
    blocks: z.ZodRecord<ReturnType<typeof HashString>, ReturnType<typeof Block>>;
  }>,
  z.ZodObject<{
    blocks: z.ZodRecord<ReturnType<typeof HashString>, z.ZodString>;
  }>
>;
export type BlocksResponse<T extends UppercaseKeys<BlocksResponseOptions>> = z.infer<BlocksResponseZodType<T>>;

export function BlocksResponse<T extends BlocksResponseOptions>(options: T): BlocksResponseZodType<UppercaseKeys<T>>;
export function BlocksResponse(options: BlocksResponseOptions) {
  return options.json_block
    ? z.object({
        blocks: z.record(HashString(), Block()),
      })
    : z.object({
        blocks: z.record(HashString(), z.string()),
      });
}
