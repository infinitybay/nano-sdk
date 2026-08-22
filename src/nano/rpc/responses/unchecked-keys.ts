import { z } from "zod";

import { Block } from "../../blocks/block";
import { BooleanDistribution } from "../../types/boolean-distribution";
import { HashString } from "../../types/hash";
import { TimestampString } from "../../types/timestamp";
import { UppercaseKeys } from "../../types/uppercase-keys";

type UncheckedKeysResponseOptions = {
  json_block: boolean;
};

type UncheckedKeysResponseZodType<T extends UppercaseKeys<UncheckedKeysResponseOptions>> = BooleanDistribution<
  T["JSON_BLOCK"],
  z.ZodObject<{
    unchecked: z.ZodUnion<
      [
        z.ZodArray<
          z.ZodObject<{
            key: ReturnType<typeof HashString>;
            hash: ReturnType<typeof HashString>;
            modified_timestamp: ReturnType<typeof TimestampString>;
            contents: ReturnType<typeof Block>;
          }>
        >,
        z.ZodLiteral<"">,
      ]
    >;
  }>,
  z.ZodObject<{
    unchecked: z.ZodUnion<
      [
        z.ZodArray<
          z.ZodObject<{
            key: ReturnType<typeof HashString>;
            hash: ReturnType<typeof HashString>;
            modified_timestamp: ReturnType<typeof TimestampString>;
            contents: z.ZodString;
          }>
        >,
        z.ZodLiteral<"">,
      ]
    >;
  }>
>;
export type UncheckedKeysResponse<T extends UppercaseKeys<UncheckedKeysResponseOptions>> = z.infer<
  UncheckedKeysResponseZodType<T>
>;

export function UncheckedKeysResponse<T extends UncheckedKeysResponseOptions>(
  options: T
): UncheckedKeysResponseZodType<UppercaseKeys<T>>;
export function UncheckedKeysResponse(options: UncheckedKeysResponseOptions) {
  return options.json_block
    ? z.object({
        unchecked: z
          .object({
            key: HashString(),
            hash: HashString(),
            modified_timestamp: TimestampString(),
            contents: Block(),
          })
          .array()
          .or(z.literal("")),
      })
    : z.object({
        unchecked: z
          .object({
            key: HashString(),
            hash: HashString(),
            modified_timestamp: TimestampString(),
            contents: z.string(),
          })
          .array()
          .or(z.literal("")),
      });
}
