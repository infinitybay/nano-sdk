import { z } from "zod";

import { Block } from "../../blocks/block";
import { BooleanDistribution } from "../../types/boolean-distribution";
import { TimestampString } from "../../types/timestamp";
import { UppercaseKeys } from "../../types/uppercase-keys";

type UncheckedGetResponseOptions = {
  json_block: boolean;
};

type UncheckedGetResponseZodType<T extends UppercaseKeys<UncheckedGetResponseOptions>> = BooleanDistribution<
  T["JSON_BLOCK"],
  z.ZodObject<{
    modified_timestamp: ReturnType<typeof TimestampString>;
    contents: ReturnType<typeof Block>;
  }>,
  z.ZodObject<{
    modified_timestamp: ReturnType<typeof TimestampString>;
    contents: z.ZodString;
  }>
>;
export type UncheckedGetResponse<T extends UppercaseKeys<UncheckedGetResponseOptions>> = z.infer<
  UncheckedGetResponseZodType<T>
>;

export function UncheckedGetResponse<T extends UncheckedGetResponseOptions>(
  options: T
): UncheckedGetResponseZodType<UppercaseKeys<T>>;
export function UncheckedGetResponse(options: UncheckedGetResponseOptions) {
  return options.json_block
    ? z.object({
        modified_timestamp: TimestampString(),
        contents: Block(),
      })
    : z.object({
        modified_timestamp: TimestampString(),
        contents: z.string(),
      });
}
