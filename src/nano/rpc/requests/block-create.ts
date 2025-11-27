import { z } from "zod";

import { AccountString } from "../../types/account";
import { RawAmountString } from "../../types/amount";
import { BooleanString } from "../../types/boolean";
import { HashString } from "../../types/hash";
import { LinkString } from "../../types/link";
import { PrivateKeyString } from "../../types/private-key";
import { PublicKeyString } from "../../types/public-key";
import { StateTypeString } from "../../types/type";
import { WorkString } from "../../types/work";

export function BlockCreateRequest() {
  return z.object({
    action: z.literal("block_create"),
    type: StateTypeString(),
    balance: RawAmountString(),
    representative: AccountString(),
    previous: HashString(),
    json_block: BooleanString().or(z.boolean()).optional(),
    key: PrivateKeyString().optional(),
    wallet: PublicKeyString().optional(),
    account: AccountString().optional(),
    destination: AccountString().optional(),
    source: HashString().optional(),
    link: LinkString().or(z.literal("0")).optional(),
    work: WorkString().optional(),
    version: z.literal("work_1").optional(),
    difficulty: WorkString().optional(),
  });
}

export type BlockCreateRequest = z.infer<ReturnType<typeof BlockCreateRequest>>;
