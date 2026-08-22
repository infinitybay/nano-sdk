import { z } from "zod";

import { AccountString } from "../../types/account";
import { RawAmountString } from "../../types/amount";
import { BooleanDistribution } from "../../types/boolean-distribution";
import { HashString } from "../../types/hash";
import { UppercaseKeys } from "../../types/uppercase-keys";

const AccountsReceivableAmounts = () => z.record(HashString(), RawAmountString());
const AccountsReceivableSources = () =>
  z.record(
    HashString(),
    z.object({
      amount: RawAmountString(),
      source: AccountString(),
    })
  );

type AccountsReceivableBlocksOptions = {
  sorting: boolean;
  source: boolean;
  threshold: boolean;
};

type AccountsReceivableBlocksZodType<T extends UppercaseKeys<AccountsReceivableBlocksOptions>> = BooleanDistribution<
  T["SOURCE"],
  z.ZodRecord<ReturnType<typeof AccountString>, ReturnType<typeof AccountsReceivableSources>>,
  BooleanDistribution<
    T["THRESHOLD"],
    z.ZodRecord<ReturnType<typeof AccountString>, ReturnType<typeof AccountsReceivableAmounts>>,
    BooleanDistribution<
      T["SORTING"],
      z.ZodRecord<ReturnType<typeof AccountString>, ReturnType<typeof AccountsReceivableAmounts>>,
      z.ZodRecord<ReturnType<typeof AccountString>, z.ZodArray<ReturnType<typeof HashString>>>
    >
  >
>;

type AccountsReceivableBlocks<T extends UppercaseKeys<AccountsReceivableBlocksOptions>> = z.infer<
  AccountsReceivableBlocksZodType<T>
>;

function AccountsReceivableBlocks<T extends AccountsReceivableBlocksOptions>(
  options: T
): AccountsReceivableBlocksZodType<UppercaseKeys<T>>;
function AccountsReceivableBlocks(options: AccountsReceivableBlocksOptions) {
  if (options.source) {
    return z.record(AccountString(), AccountsReceivableSources());
  } else if (options.threshold || options.sorting) {
    return z.record(AccountString(), AccountsReceivableAmounts());
  } else {
    return z.record(AccountString(), HashString().array());
  }
}

type AccountsReceivableResponseOptions = {
  sorting: boolean;
  source: boolean;
  threshold: boolean;
};

type AccountsReceivableResponseZodType<T extends UppercaseKeys<AccountsReceivableResponseOptions>> = z.ZodObject<{
  blocks: z.ZodUnion<[AccountsReceivableBlocksZodType<T>, z.ZodLiteral<"">]>;
}>;

export type AccountsReceivableResponse<T extends UppercaseKeys<AccountsReceivableResponseOptions>> = z.infer<
  AccountsReceivableResponseZodType<T>
>;

export function AccountsReceivableResponse<T extends AccountsReceivableResponseOptions>(
  options: T
): AccountsReceivableResponseZodType<UppercaseKeys<T>>;
export function AccountsReceivableResponse(options: AccountsReceivableResponseOptions) {
  return z.object({
    blocks: AccountsReceivableBlocks(options).or(z.literal("")),
  });
}
