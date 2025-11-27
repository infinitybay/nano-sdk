import { z } from "zod";

import { BooleanDistribution } from "../../types/boolean-distribution";
import { HashString } from "../../types/hash";
import { UppercaseKeys } from "../../types/uppercase-keys";

type ProcessResponseOptions = {
  async: boolean;
};

type ProcessResponseZodType<T extends UppercaseKeys<ProcessResponseOptions>> = BooleanDistribution<
  T["ASYNC"],
  z.ZodObject<{
    started: z.ZodLiteral<"1">;
  }>,
  z.ZodObject<{
    hash: ReturnType<typeof HashString>;
  }>
>;

export type ProcessResponse<T extends UppercaseKeys<ProcessResponseOptions>> = z.infer<ProcessResponseZodType<T>>;

export function ProcessResponse<T extends ProcessResponseOptions>(options: T): ProcessResponseZodType<UppercaseKeys<T>>;
export function ProcessResponse(options: ProcessResponseOptions) {
  return options.async
    ? z.object({
        started: z.literal("1"),
      })
    : z.object({
        hash: HashString(),
      });
}
