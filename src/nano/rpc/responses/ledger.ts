import "../../../zod-extensions";

import { z } from "zod";

import { AccountString } from "../../types/account";
import { RawAmountString } from "../../types/amount";
import { BooleanDistribution } from "../../types/boolean-distribution";
import { BooleanOption } from "../../types/boolean-option";
import { HashString } from "../../types/hash";
import { HeightString } from "../../types/height";
import { TimestampString } from "../../types/timestamp";
import { UppercaseKeys } from "../../types/uppercase-keys";

const LedgerAccountBase = () =>
  z.object({
    frontier: HashString(),
    open_block: HashString(),
    representative_block: HashString(),
    balance: RawAmountString(),
    modified_timestamp: TimestampString(),
    block_count: HeightString().transformToUInt(),
  });

type LedgerAccountOptions = {
  receivable: boolean;
  representative: boolean;
  weight: boolean;
};

type LedgerAccountZodType<T extends UppercaseKeys<LedgerAccountOptions>> = z.ZodObject<
  ReturnType<typeof LedgerAccountBase>["shape"] &
    BooleanOption<
      T["RECEIVABLE"],
      { pending: ReturnType<typeof RawAmountString>; receivable: ReturnType<typeof RawAmountString> },
      {}
    > &
    BooleanOption<T["REPRESENTATIVE"], { representative: ReturnType<typeof AccountString> }, {}> &
    BooleanOption<T["WEIGHT"], { weight: ReturnType<typeof RawAmountString> }, {}>
>;

export type LedgerAccount<T extends UppercaseKeys<LedgerAccountOptions>> = z.infer<LedgerAccountZodType<T>>;

export function LedgerAccount<T extends LedgerAccountOptions>(options: T): LedgerAccountZodType<UppercaseKeys<T>>;
export function LedgerAccount(options: LedgerAccountOptions) {
  let ledgerAccount = LedgerAccountBase();
  if (options.receivable) {
    ledgerAccount = ledgerAccount.extend({
      pending: RawAmountString(),
      receivable: RawAmountString(),
    });
  }
  if (options.representative) ledgerAccount = ledgerAccount.extend({ representative: AccountString() });
  if (options.weight) ledgerAccount = ledgerAccount.extend({ weight: RawAmountString() });
  return ledgerAccount;
}

type LedgerResponseOptions = {
  receivable: boolean;
  representative: boolean;
  weight: boolean;
};

type LedgerResponseZodType<T extends UppercaseKeys<LedgerResponseOptions>> = z.ZodObject<{
  accounts: z.ZodUnion<
    [
      z.ZodRecord<
        ReturnType<typeof AccountString>,
        BooleanDistribution<
          T["RECEIVABLE"],
          BooleanDistribution<
            T["REPRESENTATIVE"],
            BooleanDistribution<
              T["WEIGHT"],
              LedgerAccountZodType<{ RECEIVABLE: true; REPRESENTATIVE: true; WEIGHT: true }>,
              LedgerAccountZodType<{ RECEIVABLE: true; REPRESENTATIVE: true; WEIGHT: false }>
            >,
            BooleanDistribution<
              T["WEIGHT"],
              LedgerAccountZodType<{ RECEIVABLE: true; REPRESENTATIVE: false; WEIGHT: true }>,
              LedgerAccountZodType<{ RECEIVABLE: true; REPRESENTATIVE: false; WEIGHT: false }>
            >
          >,
          BooleanDistribution<
            T["REPRESENTATIVE"],
            BooleanDistribution<
              T["WEIGHT"],
              LedgerAccountZodType<{ RECEIVABLE: false; REPRESENTATIVE: true; WEIGHT: true }>,
              LedgerAccountZodType<{ RECEIVABLE: false; REPRESENTATIVE: true; WEIGHT: false }>
            >,
            BooleanDistribution<
              T["WEIGHT"],
              LedgerAccountZodType<{ RECEIVABLE: false; REPRESENTATIVE: false; WEIGHT: true }>,
              LedgerAccountZodType<{ RECEIVABLE: false; REPRESENTATIVE: false; WEIGHT: false }>
            >
          >
        >
      >,
      z.ZodLiteral<"">,
    ]
  >;
}>;

export type LedgerResponse<T extends UppercaseKeys<LedgerResponseOptions>> = z.infer<LedgerResponseZodType<T>>;

export function LedgerResponse<T extends LedgerResponseOptions>(options: T): LedgerResponseZodType<UppercaseKeys<T>>;
export function LedgerResponse(options: LedgerResponseOptions) {
  return z.object({
    accounts: z.record(AccountString(), LedgerAccount(options)).or(z.literal("")),
  });
}
