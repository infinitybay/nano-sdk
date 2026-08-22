import { z } from "zod";

import { StateBlock } from "../../blocks/state-block";
import { BooleanDistribution } from "../../types/boolean-distribution";
import { SignatureString } from "../../types/signature";
import { UppercaseKeys } from "../../types/uppercase-keys";

type SignResponseOptions = {
  block: boolean;
  json_block: boolean;
};

type SignResponseZodType<T extends UppercaseKeys<SignResponseOptions>> = BooleanDistribution<
  T["BLOCK"],
  BooleanDistribution<
    T["JSON_BLOCK"],
    z.ZodObject<{
      signature: ReturnType<typeof SignatureString>;
      block: ReturnType<typeof StateBlock>;
    }>,
    z.ZodObject<{
      signature: ReturnType<typeof SignatureString>;
      block: z.ZodString;
    }>
  >,
  z.ZodObject<{
    signature: ReturnType<typeof SignatureString>;
  }>
>;

export type SignResponse<T extends UppercaseKeys<SignResponseOptions>> = z.infer<SignResponseZodType<T>>;

export function SignResponse<T extends SignResponseOptions>(options: T): SignResponseZodType<UppercaseKeys<T>>;
export function SignResponse(options: SignResponseOptions) {
  return options.block
    ? options.json_block
      ? z.object({
          signature: SignatureString(),
          block: StateBlock(),
        })
      : z.object({
          signature: SignatureString(),
          block: z.string(),
        })
    : z.object({
        signature: SignatureString(),
      });
}
