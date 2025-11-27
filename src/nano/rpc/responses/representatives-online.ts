import { z } from "zod";

import { AccountString } from "../../types/account";
import { RawAmountString } from "../../types/amount";
import { BooleanDistribution } from "../../types/boolean-distribution";
import { UppercaseKeys } from "../../types/uppercase-keys";

type RepresentativesOnlineResponseOptions = {
  weight: boolean;
};

type RepresentativesOnlineResponseZodType<T extends UppercaseKeys<RepresentativesOnlineResponseOptions>> =
  BooleanDistribution<
    T["WEIGHT"],
    z.ZodObject<{
      representatives: z.ZodUnion<
        [
          z.ZodRecord<ReturnType<typeof AccountString>, z.ZodObject<{ weight: ReturnType<typeof RawAmountString> }>>,
          z.ZodLiteral<"">,
        ]
      >;
    }>,
    z.ZodObject<{ representatives: z.ZodUnion<[z.ZodArray<ReturnType<typeof AccountString>>, z.ZodLiteral<"">]> }>
  >;

export type RepresentativesOnlineResponse<T extends UppercaseKeys<RepresentativesOnlineResponseOptions>> = z.infer<
  RepresentativesOnlineResponseZodType<T>
>;

export function RepresentativesOnlineResponse<T extends RepresentativesOnlineResponseOptions>(
  options: T
): RepresentativesOnlineResponseZodType<UppercaseKeys<T>>;
export function RepresentativesOnlineResponse(options: RepresentativesOnlineResponseOptions) {
  return options.weight
    ? z.object({
        representatives: z
          .record(
            AccountString(),
            z.object({
              weight: RawAmountString(),
            })
          )
          .or(z.literal("")),
      })
    : z.object({
        representatives: AccountString().array().or(z.literal("")),
      });
}
