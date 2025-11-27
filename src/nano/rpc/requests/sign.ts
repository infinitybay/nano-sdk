import { z } from "zod";

import { StateBlock } from "../../blocks/state-block";
import { AccountString } from "../../types/account";
import { HashString } from "../../types/hash";
import { PrivateKeyString } from "../../types/private-key";
import { PublicKeyString } from "../../types/public-key";

export function SignRequest() {
  return z.union([
    z.object({
      action: z.literal("sign"),
      json_block: z.literal(true),
      key: PrivateKeyString().optional(),
      block: StateBlock(),
      hash: HashString().optional(),
      wallet: PublicKeyString().optional(),
      account: AccountString().optional(),
    }),
    z.object({
      action: z.literal("sign"),
      json_block: z.literal(true),
      key: PrivateKeyString().optional(),
      block: StateBlock().optional(),
      hash: HashString(),
      wallet: PublicKeyString().optional(),
      account: AccountString().optional(),
    }),
    z.object({
      action: z.literal("sign"),
      json_block: z.literal(false),
      key: PrivateKeyString().optional(),
      block: z.string(),
      hash: HashString().optional(),
      wallet: PublicKeyString().optional(),
      account: AccountString().optional(),
    }),
    z.object({
      action: z.literal("sign"),
      json_block: z.literal(false),
      key: PrivateKeyString().optional(),
      block: z.string().optional(),
      hash: HashString(),
      wallet: PublicKeyString().optional(),
      account: AccountString().optional(),
    }),
  ]);
}

export type SignRequest = z.infer<ReturnType<typeof SignRequest>>;
