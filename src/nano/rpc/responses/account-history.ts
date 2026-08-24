import { z } from "zod";

import { AccountString } from "../../types/account";
import { RawAmountString } from "../../types/amount";
import { BooleanString } from "../../types/boolean";
import { BooleanDistribution } from "../../types/boolean-distribution";
import { HashString } from "../../types/hash";
import { HeightString } from "../../types/height";
import { LinkString } from "../../types/link";
import { SignatureString } from "../../types/signature";
import { SubtypeUnknownString } from "../../types/subtype";
import { TimestampString } from "../../types/timestamp";
import {
  LegacyChangeTypeString,
  LegacyOpenTypeString,
  LegacyReceiveTypeString,
  LegacySendTypeString,
  StateTypeString,
} from "../../types/type";
import { UppercaseKeys } from "../../types/uppercase-keys";
import { WorkString } from "../../types/work";

type BaseBlockHistory = z.infer<ReturnType<typeof BaseBlockHistory>>;
const BaseBlockHistory = () =>
  z.object({
    local_timestamp: TimestampString(),
    height: HeightString(),
    hash: HashString(),
    confirmed: BooleanString(),
    work: WorkString(),
    signature: SignatureString(),
  });

type BaseStateBlockHistory = z.infer<ReturnType<typeof BaseStateBlockHistory>>;
const BaseStateBlockHistory = () =>
  BaseBlockHistory().extend({
    type: StateTypeString(),
    previous: HashString(),
    representative: AccountString(),
    balance: RawAmountString(),
    link: LinkString(),
  });

type ChangeStateBlockHistory = z.infer<ReturnType<typeof ChangeStateBlockHistory>>;
const ChangeStateBlockHistory = () =>
  BaseStateBlockHistory().extend({
    subtype: z.literal("change"),
    // No account property here
  });

type EpochStateBlockHistory = z.infer<ReturnType<typeof EpochStateBlockHistory>>;
const EpochStateBlockHistory = () =>
  BaseStateBlockHistory().extend({
    subtype: z.literal("epoch"),
    account: AccountString(), // Epoch Signer
  });

type ReceiveStateBlockHistory = z.infer<ReturnType<typeof ReceiveStateBlockHistory>>;
const ReceiveStateBlockHistory = () =>
  BaseStateBlockHistory().extend({
    subtype: z.literal("receive"),
    account: AccountString().optional(), // TODO: if request.source_account == true
    amount: RawAmountString(),
  });

type SendStateBlockHistory = z.infer<ReturnType<typeof SendStateBlockHistory>>;
const SendStateBlockHistory = () =>
  BaseStateBlockHistory().extend({
    subtype: z.literal("send"),
    account: AccountString(),
    amount: RawAmountString(),
  });

type UnknownStateBlockHistory = z.infer<ReturnType<typeof UnknownStateBlockHistory>>; // Only if pruning is enabled
const UnknownStateBlockHistory = () =>
  BaseStateBlockHistory().extend({
    subtype: SubtypeUnknownString(),
  });

type LegacyChangeBlockHistory = z.infer<ReturnType<typeof LegacyChangeBlockHistory>>;
const LegacyChangeBlockHistory = () =>
  BaseBlockHistory().extend({
    type: LegacyChangeTypeString(),
    representative: AccountString(),
    previous: HashString(),
  });

type LegacyOpenBlockHistory = z.infer<ReturnType<typeof LegacyOpenBlockHistory>>;
const LegacyOpenBlockHistory = () =>
  BaseBlockHistory().extend({
    type: LegacyOpenTypeString(),
    representative: AccountString(),
    source: HashString(),
    opened: AccountString(),
    account: AccountString(),
    amount: RawAmountString(),
  });

type LegacyReceiveBlockHistory = z.infer<ReturnType<typeof LegacyReceiveBlockHistory>>;
const LegacyReceiveBlockHistory = () =>
  BaseBlockHistory().extend({
    type: LegacyReceiveTypeString(),
    account: AccountString(),
    amount: RawAmountString(),
    source: HashString(),
    previous: HashString(),
  });

type LegacySendBlockHistory = z.infer<ReturnType<typeof LegacySendBlockHistory>>;
const LegacySendBlockHistory = () =>
  BaseBlockHistory().extend({
    type: LegacySendTypeString(),
    account: AccountString(),
    amount: RawAmountString(),
    destination: AccountString(),
    balance: RawAmountString(),
    previous: HashString(),
  });

type AccountHistoryEntryRawOptions = {
  include_linked_account: boolean;
};

type AccountHistoryEntryRawZodType<T extends UppercaseKeys<AccountHistoryEntryRawOptions>> = BooleanDistribution<
  T["INCLUDE_LINKED_ACCOUNT"],
  z.ZodUnion<
    [
      z.ZodObject<
        ReturnType<typeof ChangeStateBlockHistory>["shape"] & {
          linked_account: z.ZodUnion<[ReturnType<typeof AccountString>, z.ZodLiteral<"0">]>;
        }
      >,
      z.ZodObject<
        ReturnType<typeof EpochStateBlockHistory>["shape"] & {
          linked_account: z.ZodUnion<[ReturnType<typeof AccountString>, z.ZodLiteral<"0">]>;
        }
      >,
      z.ZodObject<
        ReturnType<typeof ReceiveStateBlockHistory>["shape"] & {
          linked_account: z.ZodUnion<[ReturnType<typeof AccountString>, z.ZodLiteral<"0">]>;
        }
      >,
      z.ZodObject<
        ReturnType<typeof SendStateBlockHistory>["shape"] & {
          linked_account: z.ZodUnion<[ReturnType<typeof AccountString>, z.ZodLiteral<"0">]>;
        }
      >,
      z.ZodObject<
        ReturnType<typeof UnknownStateBlockHistory>["shape"] & {
          linked_account: z.ZodUnion<[ReturnType<typeof AccountString>, z.ZodLiteral<"0">]>;
        }
      >,
      z.ZodObject<
        ReturnType<typeof LegacyChangeBlockHistory>["shape"] & {
          linked_account: z.ZodUnion<[ReturnType<typeof AccountString>, z.ZodLiteral<"0">]>;
        }
      >,
      z.ZodObject<
        ReturnType<typeof LegacyOpenBlockHistory>["shape"] & {
          linked_account: z.ZodUnion<[ReturnType<typeof AccountString>, z.ZodLiteral<"0">]>;
        }
      >,
      z.ZodObject<
        ReturnType<typeof LegacyReceiveBlockHistory>["shape"] & {
          linked_account: z.ZodUnion<[ReturnType<typeof AccountString>, z.ZodLiteral<"0">]>;
        }
      >,
      z.ZodObject<
        ReturnType<typeof LegacySendBlockHistory>["shape"] & {
          linked_account: z.ZodUnion<[ReturnType<typeof AccountString>, z.ZodLiteral<"0">]>;
        }
      >,
    ]
  >,
  z.ZodUnion<
    [
      ReturnType<typeof ChangeStateBlockHistory>,
      ReturnType<typeof EpochStateBlockHistory>,
      ReturnType<typeof ReceiveStateBlockHistory>,
      ReturnType<typeof SendStateBlockHistory>,
      ReturnType<typeof UnknownStateBlockHistory>,
      ReturnType<typeof LegacyChangeBlockHistory>,
      ReturnType<typeof LegacyOpenBlockHistory>,
      ReturnType<typeof LegacyReceiveBlockHistory>,
      ReturnType<typeof LegacySendBlockHistory>,
    ]
  >
>;

export type AccountHistoryEntryRaw<T extends UppercaseKeys<AccountHistoryEntryRawOptions>> = z.infer<
  AccountHistoryEntryRawZodType<T>
>;

export function AccountHistoryEntryRaw<T extends AccountHistoryEntryRawOptions>(
  options: T
): AccountHistoryEntryRawZodType<UppercaseKeys<T>>;
export function AccountHistoryEntryRaw(options: AccountHistoryEntryRawOptions) {
  return options.include_linked_account
    ? z.union([
        ChangeStateBlockHistory().extend({ linked_account: AccountString().or(z.literal("0")) }),
        EpochStateBlockHistory().extend({ linked_account: AccountString().or(z.literal("0")) }),
        ReceiveStateBlockHistory().extend({ linked_account: AccountString().or(z.literal("0")) }),
        SendStateBlockHistory().extend({ linked_account: AccountString().or(z.literal("0")) }),
        UnknownStateBlockHistory().extend({ linked_account: AccountString().or(z.literal("0")) }),
        LegacyChangeBlockHistory().extend({ linked_account: AccountString().or(z.literal("0")) }),
        LegacyOpenBlockHistory().extend({ linked_account: AccountString().or(z.literal("0")) }),
        LegacyReceiveBlockHistory().extend({ linked_account: AccountString().or(z.literal("0")) }),
        LegacySendBlockHistory().extend({ linked_account: AccountString().or(z.literal("0")) }),
      ])
    : z.union([
        ChangeStateBlockHistory(),
        EpochStateBlockHistory(),
        ReceiveStateBlockHistory(),
        SendStateBlockHistory(),
        UnknownStateBlockHistory(),
        LegacyChangeBlockHistory(),
        LegacyOpenBlockHistory(),
        LegacyReceiveBlockHistory(),
        LegacySendBlockHistory(),
      ]);
}

type AccountHistoryEntryNotRaw = z.infer<ReturnType<typeof AccountHistoryEntryNotRaw>>;
const AccountHistoryEntryNotRaw = () =>
  z.object({
    type: z.literal("send").or(z.literal("receive")),
    account: AccountString(),
    amount: RawAmountString(),
    local_timestamp: TimestampString(),
    height: HeightString(),
    hash: HashString(),
    confirmed: BooleanString(),
  });

type AccountHistoryEntryOptions = {
  include_linked_account: boolean;
  raw: boolean;
};

type AccountHistoryEntryZodType<T extends UppercaseKeys<AccountHistoryEntryOptions>> = BooleanDistribution<
  T["RAW"],
  AccountHistoryEntryRawZodType<{
    INCLUDE_LINKED_ACCOUNT: T["INCLUDE_LINKED_ACCOUNT"];
  }>,
  BooleanDistribution<
    T["INCLUDE_LINKED_ACCOUNT"],
    z.ZodObject<
      ReturnType<typeof AccountHistoryEntryNotRaw>["shape"] & {
        linked_account: z.ZodUnion<[ReturnType<typeof AccountString>, z.ZodLiteral<"0">]>;
      }
    >,
    ReturnType<typeof AccountHistoryEntryNotRaw>
  >
>;

export type AccountHistoryEntry<T extends UppercaseKeys<AccountHistoryEntryOptions>> = z.infer<
  AccountHistoryEntryZodType<T>
>;

export function AccountHistoryEntry<T extends AccountHistoryEntryOptions>(
  options: T
): AccountHistoryEntryZodType<UppercaseKeys<T>>;
export function AccountHistoryEntry(options: AccountHistoryEntryOptions) {
  return options.raw
    ? AccountHistoryEntryRaw({
        include_linked_account: options.include_linked_account,
      })
    : AccountHistoryEntryNotRaw().extend(
        options.include_linked_account ? { linked_account: AccountString().or(z.literal("0")) } : {}
      );
}

type AccountHistoryOptions = {
  include_linked_account: boolean;
  raw: boolean;
};

type AccountHistoryZodType<T extends UppercaseKeys<AccountHistoryOptions>> = z.ZodArray<AccountHistoryEntryZodType<T>>;

export type AccountHistory<T extends UppercaseKeys<AccountHistoryOptions>> = z.infer<AccountHistoryZodType<T>>;

function AccountHistory<T extends AccountHistoryOptions>(options: T): AccountHistoryZodType<UppercaseKeys<T>>;
function AccountHistory(options: AccountHistoryOptions) {
  return AccountHistoryEntry(options).array();
}

type AccountHistoryResponseOptions = {
  include_linked_account: boolean;
  raw: boolean;
  reverse: boolean;
};

type AccountHistoryResponseZodType<T extends UppercaseKeys<AccountHistoryResponseOptions>> = BooleanDistribution<
  T["REVERSE"],
  z.ZodObject<{
    account: ReturnType<typeof AccountString>;
    history: z.ZodUnion<[AccountHistoryZodType<T>, z.ZodLiteral<"">]>;
    next: z.ZodOptional<ReturnType<typeof HashString>>;
  }>,
  z.ZodObject<{
    account: ReturnType<typeof AccountString>;
    history: z.ZodUnion<[AccountHistoryZodType<T>, z.ZodLiteral<"">]>;
    previous: z.ZodOptional<ReturnType<typeof HashString>>;
  }>
>;

export type AccountHistoryResponse<T extends UppercaseKeys<AccountHistoryResponseOptions>> = z.infer<
  AccountHistoryResponseZodType<T>
>;

export function AccountHistoryResponse<T extends AccountHistoryResponseOptions>(
  options: T
): AccountHistoryResponseZodType<UppercaseKeys<T>>;
export function AccountHistoryResponse(options: AccountHistoryResponseOptions) {
  return options.reverse
    ? z.object({
        account: AccountString(),
        history: AccountHistory({
          include_linked_account: options.include_linked_account,
          raw: options.raw,
        }).or(z.literal("")),
        next: HashString().optional(),
      })
    : z.object({
        account: AccountString(),
        history: AccountHistory({
          include_linked_account: options.include_linked_account,
          raw: options.raw,
        }).or(z.literal("")),
        previous: HashString().optional(),
      });
}
