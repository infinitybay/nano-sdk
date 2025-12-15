import { z } from "zod";

import { AccountString } from "../../types/account";
import { RawAmountString } from "../../types/amount";
import { BooleanDistribution } from "../../types/boolean-distribution";
import { BooleanOption } from "../../types/boolean-option";
import { HashString } from "../../types/hash";
import { HeightString } from "../../types/height";
import { TimestampString } from "../../types/timestamp";
import { UIntString } from "../../types/uint";
import { UppercaseKeys } from "../../types/uppercase-keys";

const AccountInfoBase = () =>
  z.object({
    frontier: HashString(),
    open_block: HashString(),
    representative_block: HashString(),
    balance: RawAmountString(),
    modified_timestamp: TimestampString(),
    block_count: UIntString(),
    account_version: UIntString(),
  });

const AccountInfoRepresentative = () => ({
  representative: AccountString(),
});

const AccountInfoWeight = () => ({
  weight: RawAmountString(),
});

const AccountInfoReceivable = () => ({
  receivable: RawAmountString(),
});

const AccountInfoConfirmedBase = () => ({
  confirmed_balance: RawAmountString(),
  confirmed_height: HeightString(),
  confirmed_frontier: HashString(),
});

const AccountInfoConfirmedRepresentative = () => ({
  confirmed_representative: AccountString(),
});

const AccountInfoConfirmedReceivable = () => ({
  confirmed_receivable: RawAmountString(),
});

type AccountInfoResponseOptions = {
  representative: boolean;
  weight: boolean;
  receivable: boolean;
  include_confirmed: boolean;
};

type AccountInfoResponseBaseZodType<T extends UppercaseKeys<AccountInfoResponseOptions>> = z.ZodObject<
  ReturnType<typeof AccountInfoBase>["shape"] &
    BooleanOption<T["REPRESENTATIVE"], ReturnType<typeof AccountInfoRepresentative>, {}> &
    BooleanOption<T["WEIGHT"], ReturnType<typeof AccountInfoWeight>, {}> &
    BooleanOption<T["RECEIVABLE"], ReturnType<typeof AccountInfoReceivable>, {}> &
    BooleanOption<
      T["INCLUDE_CONFIRMED"],
      ReturnType<typeof AccountInfoConfirmedBase> &
        BooleanOption<T["REPRESENTATIVE"], ReturnType<typeof AccountInfoConfirmedRepresentative>, {}> &
        BooleanOption<T["RECEIVABLE"], ReturnType<typeof AccountInfoConfirmedReceivable>, {}>,
      {}
    >
>;

type AccountInfoResponseZodType<T extends UppercaseKeys<AccountInfoResponseOptions>> = BooleanDistribution<
  T["INCLUDE_CONFIRMED"],
  BooleanDistribution<
    T["REPRESENTATIVE"],
    BooleanDistribution<
      T["WEIGHT"],
      BooleanDistribution<
        T["RECEIVABLE"],
        AccountInfoResponseBaseZodType<{
          REPRESENTATIVE: true;
          WEIGHT: true;
          RECEIVABLE: true;
          INCLUDE_CONFIRMED: true;
        }>,
        AccountInfoResponseBaseZodType<{
          REPRESENTATIVE: true;
          WEIGHT: true;
          RECEIVABLE: false;
          INCLUDE_CONFIRMED: true;
        }>
      >,
      BooleanDistribution<
        T["RECEIVABLE"],
        AccountInfoResponseBaseZodType<{
          REPRESENTATIVE: true;
          WEIGHT: false;
          RECEIVABLE: true;
          INCLUDE_CONFIRMED: true;
        }>,
        AccountInfoResponseBaseZodType<{
          REPRESENTATIVE: true;
          WEIGHT: false;
          RECEIVABLE: false;
          INCLUDE_CONFIRMED: true;
        }>
      >
    >,
    BooleanDistribution<
      T["WEIGHT"],
      BooleanDistribution<
        T["RECEIVABLE"],
        AccountInfoResponseBaseZodType<{
          REPRESENTATIVE: false;
          WEIGHT: true;
          RECEIVABLE: true;
          INCLUDE_CONFIRMED: true;
        }>,
        AccountInfoResponseBaseZodType<{
          REPRESENTATIVE: false;
          WEIGHT: true;
          RECEIVABLE: false;
          INCLUDE_CONFIRMED: true;
        }>
      >,
      BooleanDistribution<
        T["RECEIVABLE"],
        AccountInfoResponseBaseZodType<{
          REPRESENTATIVE: false;
          WEIGHT: false;
          RECEIVABLE: true;
          INCLUDE_CONFIRMED: true;
        }>,
        AccountInfoResponseBaseZodType<{
          REPRESENTATIVE: false;
          WEIGHT: false;
          RECEIVABLE: false;
          INCLUDE_CONFIRMED: true;
        }>
      >
    >
  >,
  BooleanDistribution<
    T["REPRESENTATIVE"],
    BooleanDistribution<
      T["WEIGHT"],
      BooleanDistribution<
        T["RECEIVABLE"],
        AccountInfoResponseBaseZodType<{
          REPRESENTATIVE: true;
          WEIGHT: true;
          RECEIVABLE: true;
          INCLUDE_CONFIRMED: false;
        }>,
        AccountInfoResponseBaseZodType<{
          REPRESENTATIVE: true;
          WEIGHT: true;
          RECEIVABLE: false;
          INCLUDE_CONFIRMED: false;
        }>
      >,
      BooleanDistribution<
        T["RECEIVABLE"],
        AccountInfoResponseBaseZodType<{
          REPRESENTATIVE: true;
          WEIGHT: false;
          RECEIVABLE: true;
          INCLUDE_CONFIRMED: false;
        }>,
        AccountInfoResponseBaseZodType<{
          REPRESENTATIVE: true;
          WEIGHT: false;
          RECEIVABLE: false;
          INCLUDE_CONFIRMED: false;
        }>
      >
    >,
    BooleanDistribution<
      T["WEIGHT"],
      BooleanDistribution<
        T["RECEIVABLE"],
        AccountInfoResponseBaseZodType<{
          REPRESENTATIVE: false;
          WEIGHT: true;
          RECEIVABLE: true;
          INCLUDE_CONFIRMED: false;
        }>,
        AccountInfoResponseBaseZodType<{
          REPRESENTATIVE: false;
          WEIGHT: true;
          RECEIVABLE: false;
          INCLUDE_CONFIRMED: false;
        }>
      >,
      BooleanDistribution<
        T["RECEIVABLE"],
        AccountInfoResponseBaseZodType<{
          REPRESENTATIVE: false;
          WEIGHT: false;
          RECEIVABLE: true;
          INCLUDE_CONFIRMED: false;
        }>,
        AccountInfoResponseBaseZodType<{
          REPRESENTATIVE: false;
          WEIGHT: false;
          RECEIVABLE: false;
          INCLUDE_CONFIRMED: false;
        }>
      >
    >
  >
>;

export type AccountInfoResponse<T extends UppercaseKeys<AccountInfoResponseOptions>> = z.infer<
  AccountInfoResponseZodType<T>
>;

export function AccountInfoResponse<T extends AccountInfoResponseOptions>(
  options: T
): AccountInfoResponseZodType<UppercaseKeys<T>>;
export function AccountInfoResponse(options: AccountInfoResponseOptions) {
  return options.include_confirmed
    ? AccountInfoBase()
        .extend(options.representative ? AccountInfoRepresentative() : {})
        .extend(options.weight ? AccountInfoWeight() : {})
        .extend(options.receivable ? AccountInfoReceivable() : {})
        .extend(AccountInfoConfirmedBase())
        .extend(options.representative ? AccountInfoConfirmedRepresentative() : {})
        .extend(options.receivable ? AccountInfoConfirmedReceivable() : {})
    : AccountInfoBase()
        .extend(options.representative ? AccountInfoRepresentative() : {})
        .extend(options.weight ? AccountInfoWeight() : {})
        .extend(options.receivable ? AccountInfoReceivable() : {});
}
