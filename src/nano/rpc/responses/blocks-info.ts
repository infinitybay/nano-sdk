import { z } from "zod";

import { BooleanDistribution } from "../../types/boolean-distribution";
import { BooleanOption } from "../../types/boolean-option";
import { HashString } from "../../types/hash";
import { UppercaseKeys } from "../../types/uppercase-keys";
import { BlockInfo, BlockInfoZodType } from "./block-info";

export type BlocksInfoResponseOptions = {
  include_linked_account: boolean;
  include_not_found: boolean;
  json_block: boolean;
  receivable: boolean;
  receive_hash: boolean;
  source: boolean;
};

export type BlocksInfoResponseBaseZodType<T extends UppercaseKeys<BlocksInfoResponseOptions>> = z.ZodObject<
  {
    blocks: z.ZodUnion<[z.ZodRecord<ReturnType<typeof HashString>, BlockInfoZodType<T>>, z.ZodLiteral<"">]>;
  } & BooleanOption<
    T["INCLUDE_NOT_FOUND"],
    { blocks_not_found: z.ZodUnion<[z.ZodArray<ReturnType<typeof HashString>>, z.ZodLiteral<"">]> },
    {}
  >
>;

export type BlocksInfoResponseZodType<T extends UppercaseKeys<BlocksInfoResponseOptions>> = BooleanDistribution<
  T["INCLUDE_NOT_FOUND"],
  BlocksInfoResponseBaseZodType<Omit<T, "INCLUDE_NOT_FOUND"> & { INCLUDE_NOT_FOUND: true }>,
  BlocksInfoResponseBaseZodType<Omit<T, "INCLUDE_NOT_FOUND"> & { INCLUDE_NOT_FOUND: false }>
>;

export type BlocksInfoResponse<T extends UppercaseKeys<BlocksInfoResponseOptions>> = z.infer<
  BlocksInfoResponseZodType<T>
>;

export function BlocksInfoResponse<T extends BlocksInfoResponseOptions>(
  options: T
): BlocksInfoResponseZodType<UppercaseKeys<T>>;
export function BlocksInfoResponse(options: BlocksInfoResponseOptions) {
  return z
    .object({
      blocks: z
        .record(
          HashString(),
          BlockInfo({
            include_linked_account: options.include_linked_account,
            json_block: options.json_block,
            receivable: options.receivable,
            receive_hash: options.receive_hash,
            source: options.source,
          })
        )
        .or(z.literal("")),
    })
    .extend(options.include_not_found ? { blocks_not_found: HashString().array().or(z.literal("")) } : {});
}
