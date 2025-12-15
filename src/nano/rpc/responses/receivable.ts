import { z } from "zod";

import { AccountString } from "../../types/account";
import { RawAmountString } from "../../types/amount";
import { BooleanDistribution } from "../../types/boolean-distribution";
import { HashString } from "../../types/hash";
import { UIntString } from "../../types/uint";
import { UppercaseKeys } from "../../types/uppercase-keys";

type ReceivableBlocksOptions = {
  min_version: boolean;
  source: boolean;
  threshold: boolean;
};

type ReceivableBlocksZodType<T extends UppercaseKeys<ReceivableBlocksOptions>> = BooleanDistribution<
  T["MIN_VERSION"],
  BooleanDistribution<
    T["SOURCE"],
    z.ZodRecord<
      ReturnType<typeof HashString>,
      z.ZodObject<{
        amount: ReturnType<typeof RawAmountString>;
        source: ReturnType<typeof AccountString>;
        min_version: ReturnType<typeof UIntString>;
      }>
    >,
    z.ZodRecord<
      ReturnType<typeof HashString>,
      z.ZodObject<{ amount: ReturnType<typeof RawAmountString>; min_version: ReturnType<typeof UIntString> }>
    >
  >,
  BooleanDistribution<
    T["SOURCE"],
    z.ZodRecord<
      ReturnType<typeof HashString>,
      z.ZodObject<{ amount: ReturnType<typeof RawAmountString>; source: ReturnType<typeof AccountString> }>
    >,
    BooleanDistribution<
      T["THRESHOLD"],
      z.ZodRecord<ReturnType<typeof HashString>, ReturnType<typeof RawAmountString>>,
      z.ZodArray<ReturnType<typeof HashString>>
    >
  >
>;

type ReceivableBlocks<T extends UppercaseKeys<ReceivableBlocksOptions>> = z.infer<ReceivableBlocksZodType<T>>;

function ReceivableBlocks<T extends ReceivableBlocksOptions>(
  options: T
): ReceivableBlocksZodType<UppercaseKeys<ReceivableBlocksOptions>>;
function ReceivableBlocks(options: ReceivableBlocksOptions) {
  if (options.min_version) {
    if (options.source) {
      return z.record(
        HashString(),
        z.object({
          amount: RawAmountString(),
          source: AccountString(),
          min_version: UIntString(),
        })
      );
    } else {
      return z.record(
        HashString(),
        z.object({
          amount: RawAmountString(),
          min_version: UIntString(),
        })
      );
    }
  }

  if (options.source) {
    return z.record(
      HashString(),
      z.object({
        amount: RawAmountString(),
        source: AccountString(),
      })
    );
  } else if (options.threshold) {
    return z.record(HashString(), RawAmountString());
  } else {
    return HashString().array();
  }
}

type ReceivableResponseOptions = {
  min_version: boolean;
  source: boolean;
  threshold: boolean;
};

type ReceivableResponseZodType<T extends UppercaseKeys<ReceivableResponseOptions>> = z.ZodObject<{
  blocks: z.ZodUnion<[ReceivableBlocksZodType<T>, z.ZodLiteral<"">]>;
}>;

export type ReceivableResponse<T extends UppercaseKeys<ReceivableResponseOptions>> = z.infer<
  ReceivableResponseZodType<T>
>;

export function ReceivableResponse<T extends ReceivableResponseOptions>(
  options: T
): ReceivableResponseZodType<UppercaseKeys<T>>;
export function ReceivableResponse(options: ReceivableResponseOptions) {
  return z.object({
    blocks: ReceivableBlocks(options).or(z.literal("")),
  });
}
