import { z } from "zod";

import { Block } from "../../blocks/block";
import { AccountString } from "../../types/account";
import { RawAmountString } from "../../types/amount";
import { BooleanDistribution } from "../../types/boolean-distribution";
import { HashString } from "../../types/hash";
import { UIntString } from "../../types/uint";
import { UppercaseKeys } from "../../types/uppercase-keys";

type ConfirmationInfoBlocksOptions = {
  contents: boolean;
  json_block: boolean;
  representatives: boolean;
};

type ConfirmationInfoBlocksZodType<T extends UppercaseKeys<ConfirmationInfoBlocksOptions>> = BooleanDistribution<
  T["CONTENTS"],
  BooleanDistribution<
    T["JSON_BLOCK"],
    BooleanDistribution<
      T["REPRESENTATIVES"],
      z.ZodRecord<
        ReturnType<typeof HashString>,
        z.ZodObject<{
          tally: ReturnType<typeof RawAmountString>;
          contents: ReturnType<typeof Block>;
          representatives: z.ZodRecord<ReturnType<typeof AccountString>, ReturnType<typeof RawAmountString>>;
          representatives_final: z.ZodRecord<ReturnType<typeof AccountString>, ReturnType<typeof RawAmountString>>;
        }>
      >,
      z.ZodRecord<
        ReturnType<typeof HashString>,
        z.ZodObject<{
          tally: ReturnType<typeof RawAmountString>;
          contents: ReturnType<typeof Block>;
        }>
      >
    >,
    BooleanDistribution<
      T["REPRESENTATIVES"],
      z.ZodRecord<
        ReturnType<typeof HashString>,
        z.ZodObject<{
          tally: ReturnType<typeof RawAmountString>;
          contents: z.ZodString;
          representatives: z.ZodRecord<ReturnType<typeof AccountString>, ReturnType<typeof RawAmountString>>;
          representatives_final: z.ZodRecord<ReturnType<typeof AccountString>, ReturnType<typeof RawAmountString>>;
        }>
      >,
      z.ZodRecord<
        ReturnType<typeof HashString>,
        z.ZodObject<{
          tally: ReturnType<typeof RawAmountString>;
          contents: z.ZodString;
        }>
      >
    >
  >,
  BooleanDistribution<
    T["REPRESENTATIVES"],
    z.ZodRecord<
      ReturnType<typeof HashString>,
      z.ZodObject<{
        tally: ReturnType<typeof RawAmountString>;
        representatives: z.ZodRecord<ReturnType<typeof AccountString>, ReturnType<typeof RawAmountString>>;
        representatives_final: z.ZodRecord<ReturnType<typeof AccountString>, ReturnType<typeof RawAmountString>>;
      }>
    >,
    z.ZodRecord<
      ReturnType<typeof HashString>,
      z.ZodObject<{
        tally: ReturnType<typeof RawAmountString>;
      }>
    >
  >
>;

type ConfirmationInfoBlocks<T extends UppercaseKeys<ConfirmationInfoBlocksOptions>> = z.infer<
  ConfirmationInfoBlocksZodType<T>
>;

function ConfirmationInfoBlocks<T extends ConfirmationInfoBlocksOptions>(
  options: T
): ConfirmationInfoBlocksZodType<UppercaseKeys<T>>;
function ConfirmationInfoBlocks(options: ConfirmationInfoBlocksOptions) {
  let value = z.object({
    tally: RawAmountString(),
  });

  if (options.contents) {
    if (options.json_block) {
      value = value.extend({ contents: Block() });
    } else {
      value = value.extend({ contents: z.string() });
    }
  }

  if (options.representatives) {
    value = value.extend({
      representatives: z.record(AccountString(), RawAmountString()),
      representatives_final: z.record(AccountString(), RawAmountString()),
    });
  }

  return z.record(HashString(), value);
}

type ConfirmationInfoResponseOptions = {
  contents: boolean;
  json_block: boolean;
  representatives: boolean;
};

type ConfirmationInfoResponseZodType<T extends UppercaseKeys<ConfirmationInfoResponseOptions>> = z.ZodObject<{
  announcements: ReturnType<typeof UIntString>;
  voters: ReturnType<typeof UIntString>;
  last_winner: ReturnType<typeof HashString>;
  total_tally: ReturnType<typeof RawAmountString>;
  final_tally: ReturnType<typeof RawAmountString>;
  blocks: ConfirmationInfoBlocksZodType<T>;
}>;

export type ConfirmationInfoResponse<T extends UppercaseKeys<ConfirmationInfoResponseOptions>> = z.infer<
  ConfirmationInfoResponseZodType<T>
>;

export function ConfirmationInfoResponse<T extends ConfirmationInfoResponseOptions>(
  options: T
): ConfirmationInfoResponseZodType<UppercaseKeys<T>>;
export function ConfirmationInfoResponse(options: ConfirmationInfoResponseOptions) {
  return z.object({
    announcements: UIntString(),
    voters: UIntString(),
    last_winner: HashString(),
    total_tally: RawAmountString(),
    final_tally: RawAmountString(),
    blocks: ConfirmationInfoBlocks(options),
  });
}
