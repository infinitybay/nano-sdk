import { z } from "zod";

import { Block } from "../../blocks/block";
import { AccountString } from "../../types/account";
import { RawAmountString } from "../../types/amount";
import { BinaryBooleanString } from "../../types/binary-boolean-string";
import { BooleanString } from "../../types/boolean";
import { BooleanDistribution } from "../../types/boolean-distribution";
import { BooleanOption } from "../../types/boolean-option";
import { HashString } from "../../types/hash";
import { HeightString } from "../../types/height";
import { SubtypeString } from "../../types/subtype";
import { TimestampString } from "../../types/timestamp";
import { UppercaseKeys } from "../../types/uppercase-keys";

type BlockInfoBase = z.infer<ReturnType<typeof BlockInfoBase>>;
const BlockInfoBase = () =>
  z.object({
    block_account: AccountString(),
    amount: RawAmountString().optional(),
    balance: RawAmountString(),
    height: HeightString(),
    topo_height: HeightString(),
    local_timestamp: TimestampString(),
    successor: HashString(),
    confirmed: BooleanString(),
    subtype: SubtypeString().optional(),
  });

type BlockInfoOptions = {
  include_linked_account: boolean;
  json_block: boolean;
  receivable: boolean;
  receive_hash: boolean;
  source: boolean;
};

export type BlockInfoBaseZodType<T extends UppercaseKeys<BlockInfoOptions>> = z.ZodObject<
  ReturnType<typeof BlockInfoBase>["shape"] &
    BooleanOption<
      T["INCLUDE_LINKED_ACCOUNT"],
      { linked_account: z.ZodUnion<[ReturnType<typeof AccountString>, z.ZodLiteral<"0">]> },
      {}
    > &
    BooleanOption<T["JSON_BLOCK"], { contents: ReturnType<typeof Block> }, { contents: z.ZodString }> &
    BooleanOption<T["RECEIVABLE"], { receivable: ReturnType<typeof BinaryBooleanString> }, {}> &
    BooleanOption<
      T["RECEIVE_HASH"],
      { receive_hash: z.ZodUnion<[ReturnType<typeof HashString>, z.ZodLiteral<"0">]> },
      {}
    > &
    BooleanOption<
      T["SOURCE"],
      { source_account: z.ZodUnion<[ReturnType<typeof AccountString>, z.ZodLiteral<"0">]> },
      {}
    >
>;

// prettier-ignore
export type BlockInfoZodType<T extends UppercaseKeys<BlockInfoOptions>> =
  BooleanDistribution<T["INCLUDE_LINKED_ACCOUNT"],
    BooleanDistribution<T["JSON_BLOCK"],
      BooleanDistribution<T["RECEIVABLE"],
        BooleanDistribution<T["RECEIVE_HASH"],
          BooleanDistribution<T["SOURCE"],
            BlockInfoBaseZodType<{ INCLUDE_LINKED_ACCOUNT: true, JSON_BLOCK: true, RECEIVABLE: true, RECEIVE_HASH: true, SOURCE: true }>,
            BlockInfoBaseZodType<{ INCLUDE_LINKED_ACCOUNT: true, JSON_BLOCK: true, RECEIVABLE: true, RECEIVE_HASH: true, SOURCE: false }>
          >,
          BooleanDistribution<T["SOURCE"],
            BlockInfoBaseZodType<{ INCLUDE_LINKED_ACCOUNT: true, JSON_BLOCK: true, RECEIVABLE: true, RECEIVE_HASH: false, SOURCE: true }>,
            BlockInfoBaseZodType<{ INCLUDE_LINKED_ACCOUNT: true, JSON_BLOCK: true, RECEIVABLE: true, RECEIVE_HASH: false, SOURCE: false }>
          >
        >
        ,
        BooleanDistribution<T["RECEIVE_HASH"],
          BooleanDistribution<T["SOURCE"],
            BlockInfoBaseZodType<{ INCLUDE_LINKED_ACCOUNT: true, JSON_BLOCK: true, RECEIVABLE: false, RECEIVE_HASH: true, SOURCE: true }>,
            BlockInfoBaseZodType<{ INCLUDE_LINKED_ACCOUNT: true, JSON_BLOCK: true, RECEIVABLE: false, RECEIVE_HASH: true, SOURCE: false }>
          >,
          BooleanDistribution<T["SOURCE"],
            BlockInfoBaseZodType<{ INCLUDE_LINKED_ACCOUNT: true, JSON_BLOCK: true, RECEIVABLE: false, RECEIVE_HASH: false, SOURCE: true }>,
            BlockInfoBaseZodType<{ INCLUDE_LINKED_ACCOUNT: true, JSON_BLOCK: true, RECEIVABLE: false, RECEIVE_HASH: false, SOURCE: false }>
          >
        >
      >,
      BooleanDistribution<T["RECEIVABLE"],
        BooleanDistribution<T["RECEIVE_HASH"],
          BooleanDistribution<T["SOURCE"],
            BlockInfoBaseZodType<{ INCLUDE_LINKED_ACCOUNT: true, JSON_BLOCK: false, RECEIVABLE: true, RECEIVE_HASH: true, SOURCE: true }>,
            BlockInfoBaseZodType<{ INCLUDE_LINKED_ACCOUNT: true, JSON_BLOCK: false, RECEIVABLE: true, RECEIVE_HASH: true, SOURCE: false }>
          >,
          BooleanDistribution<T["SOURCE"],
            BlockInfoBaseZodType<{ INCLUDE_LINKED_ACCOUNT: true, JSON_BLOCK: false, RECEIVABLE: true, RECEIVE_HASH: false, SOURCE: true }>,
            BlockInfoBaseZodType<{ INCLUDE_LINKED_ACCOUNT: true, JSON_BLOCK: false, RECEIVABLE: true, RECEIVE_HASH: false, SOURCE: false }>
          >
        >
        ,
        BooleanDistribution<T["RECEIVE_HASH"],
          BooleanDistribution<T["SOURCE"],
            BlockInfoBaseZodType<{ INCLUDE_LINKED_ACCOUNT: true, JSON_BLOCK: false, RECEIVABLE: false, RECEIVE_HASH: true, SOURCE: true }>,
            BlockInfoBaseZodType<{ INCLUDE_LINKED_ACCOUNT: true, JSON_BLOCK: false, RECEIVABLE: false, RECEIVE_HASH: true, SOURCE: false }>
          >,
          BooleanDistribution<T["SOURCE"],
            BlockInfoBaseZodType<{ INCLUDE_LINKED_ACCOUNT: true, JSON_BLOCK: false, RECEIVABLE: false, RECEIVE_HASH: false, SOURCE: true }>,
            BlockInfoBaseZodType<{ INCLUDE_LINKED_ACCOUNT: true, JSON_BLOCK: false, RECEIVABLE: false, RECEIVE_HASH: false, SOURCE: false }>
          >
        >
      >
    >,
    BooleanDistribution<T["JSON_BLOCK"],
      BooleanDistribution<T["RECEIVABLE"],
        BooleanDistribution<T["RECEIVE_HASH"],
          BooleanDistribution<T["SOURCE"],
            BlockInfoBaseZodType<{ INCLUDE_LINKED_ACCOUNT: false, JSON_BLOCK: true, RECEIVABLE: true, RECEIVE_HASH: true, SOURCE: true }>,
            BlockInfoBaseZodType<{ INCLUDE_LINKED_ACCOUNT: false, JSON_BLOCK: true, RECEIVABLE: true, RECEIVE_HASH: true, SOURCE: false }>
          >,
          BooleanDistribution<T["SOURCE"],
            BlockInfoBaseZodType<{ INCLUDE_LINKED_ACCOUNT: false, JSON_BLOCK: true, RECEIVABLE: true, RECEIVE_HASH: false, SOURCE: true }>,
            BlockInfoBaseZodType<{ INCLUDE_LINKED_ACCOUNT: false, JSON_BLOCK: true, RECEIVABLE: true, RECEIVE_HASH: false, SOURCE: false }>
          >
        >
        ,
        BooleanDistribution<T["RECEIVE_HASH"],
          BooleanDistribution<T["SOURCE"],
            BlockInfoBaseZodType<{ INCLUDE_LINKED_ACCOUNT: false, JSON_BLOCK: true, RECEIVABLE: false, RECEIVE_HASH: true, SOURCE: true }>,
            BlockInfoBaseZodType<{ INCLUDE_LINKED_ACCOUNT: false, JSON_BLOCK: true, RECEIVABLE: false, RECEIVE_HASH: true, SOURCE: false }>
          >,
          BooleanDistribution<T["SOURCE"],
            BlockInfoBaseZodType<{ INCLUDE_LINKED_ACCOUNT: false, JSON_BLOCK: true, RECEIVABLE: false, RECEIVE_HASH: false, SOURCE: true }>,
            BlockInfoBaseZodType<{ INCLUDE_LINKED_ACCOUNT: false, JSON_BLOCK: true, RECEIVABLE: false, RECEIVE_HASH: false, SOURCE: false }>
          >
        >
      >,
      BooleanDistribution<T["RECEIVABLE"],
        BooleanDistribution<T["RECEIVE_HASH"],
          BooleanDistribution<T["SOURCE"],
            BlockInfoBaseZodType<{ INCLUDE_LINKED_ACCOUNT: false, JSON_BLOCK: false, RECEIVABLE: true, RECEIVE_HASH: true, SOURCE: true }>,
            BlockInfoBaseZodType<{ INCLUDE_LINKED_ACCOUNT: false, JSON_BLOCK: false, RECEIVABLE: true, RECEIVE_HASH: true, SOURCE: false }>
          >,
          BooleanDistribution<T["SOURCE"],
            BlockInfoBaseZodType<{ INCLUDE_LINKED_ACCOUNT: false, JSON_BLOCK: false, RECEIVABLE: true, RECEIVE_HASH: false, SOURCE: true }>,
            BlockInfoBaseZodType<{ INCLUDE_LINKED_ACCOUNT: false, JSON_BLOCK: false, RECEIVABLE: true, RECEIVE_HASH: false, SOURCE: false }>
          >
        >
        ,
        BooleanDistribution<T["RECEIVE_HASH"],
          BooleanDistribution<T["SOURCE"],
            BlockInfoBaseZodType<{ INCLUDE_LINKED_ACCOUNT: false, JSON_BLOCK: false, RECEIVABLE: false, RECEIVE_HASH: true, SOURCE: true }>,
            BlockInfoBaseZodType<{ INCLUDE_LINKED_ACCOUNT: false, JSON_BLOCK: false, RECEIVABLE: false, RECEIVE_HASH: true, SOURCE: false }>
          >,
          BooleanDistribution<T["SOURCE"],
            BlockInfoBaseZodType<{ INCLUDE_LINKED_ACCOUNT: false, JSON_BLOCK: false, RECEIVABLE: false, RECEIVE_HASH: false, SOURCE: true }>,
            BlockInfoBaseZodType<{ INCLUDE_LINKED_ACCOUNT: false, JSON_BLOCK: false, RECEIVABLE: false, RECEIVE_HASH: false, SOURCE: false }>
          >
        >
      >
    >
  >;

export type BlockInfo<T extends UppercaseKeys<BlockInfoOptions>> = z.infer<BlockInfoZodType<T>>;

export function BlockInfo<T extends BlockInfoOptions>(options: T): BlockInfoZodType<UppercaseKeys<T>>;
export function BlockInfo(options: BlockInfoOptions): unknown {
  return BlockInfoBase()
    .extend(options.include_linked_account ? { linked_account: AccountString().or(z.literal("0")) } : {})
    .extend(options.json_block ? { contents: Block() } : { contents: z.string() })
    .extend(options.receivable ? { receivable: BinaryBooleanString() } : {})
    .extend(options.receive_hash ? { receive_hash: HashString().or(z.literal("0")) } : {})
    .extend(options.source ? { source_account: AccountString().or(z.literal("0")) } : {});
}

type BlockInfoResponseOptions = {
  include_linked_account: boolean;
  json_block: boolean;
};

export type BlockInfoResponse<T extends UppercaseKeys<BlockInfoResponseOptions>> = BlockInfo<
  T & {
    RECEIVABLE: false;
    RECEIVE_HASH: false;
    SOURCE: false;
  }
>;

export function BlockInfoResponse<T extends BlockInfoResponseOptions>(
  options: T
): BlockInfoZodType<
  UppercaseKeys<T> & {
    RECEIVABLE: false;
    RECEIVE_HASH: false;
    SOURCE: false;
  }
>;
export function BlockInfoResponse(options: BlockInfoResponseOptions) {
  return BlockInfo({
    include_linked_account: options.include_linked_account,
    json_block: options.json_block,
    receivable: false,
    receive_hash: false,
    source: false,
  });
}
