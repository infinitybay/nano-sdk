import { z } from "zod";

import { Block } from "../../blocks/block";
import { BooleanDistribution } from "../../types/boolean-distribution";
import { HashString } from "../../types/hash";
import { UppercaseKeys } from "../../types/uppercase-keys";

type UncheckedResponseOptions = {
  json_block: boolean;
};

type UncheckedResponseZodType<T extends UppercaseKeys<UncheckedResponseOptions>> = BooleanDistribution<
  T["JSON_BLOCK"],
  z.ZodObject<{
    blocks: z.ZodUnion<[z.ZodRecord<ReturnType<typeof HashString>, ReturnType<typeof Block>>, z.ZodLiteral<"">]>;
  }>,
  z.ZodObject<{
    blocks: z.ZodUnion<[z.ZodRecord<ReturnType<typeof HashString>, z.ZodString>, z.ZodLiteral<"">]>;
  }>
>;
export type UncheckedResponse<T extends UppercaseKeys<UncheckedResponseOptions>> = z.infer<UncheckedResponseZodType<T>>;

export function UncheckedResponse<T extends UncheckedResponseOptions>(
  options: T
): UncheckedResponseZodType<UppercaseKeys<T>>;
export function UncheckedResponse(options: UncheckedResponseOptions) {
  return options.json_block
    ? z.object({
        blocks: z.record(HashString(), Block()).or(z.literal("")),
      })
    : z.object({
        blocks: z.record(HashString(), z.string()).or(z.literal("")),
      });
}
