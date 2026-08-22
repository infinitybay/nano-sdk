import { z } from "zod";

import { StateBlock, StateBlockString } from "../../blocks/state-block";
import { AccountString } from "../../types/account";
import { HashString } from "../../types/hash";
import { PrivateKeyString } from "../../types/private-key";
import { PublicKeyString } from "../../types/public-key";

const KeyCredentials = {
  key: PrivateKeyString(),
  wallet: z.never().optional(),
  account: z.never().optional(),
};

const WalletCredentials = {
  key: z.never().optional(),
  wallet: PublicKeyString(),
  account: AccountString(),
};

const JsonBlock = {
  json_block: z.literal(true),
  block: StateBlock(),
  hash: z.never().optional(),
};

const StringBlock = {
  json_block: z.literal(false).optional(),
  block: StateBlockString(),
  hash: z.never().optional(),
};

const Hash = {
  json_block: z.boolean().optional(),
  block: z.never().optional(),
  hash: HashString(),
};

export function SignRequest() {
  return z.union([
    z.object({ action: z.literal("sign"), ...KeyCredentials, ...JsonBlock }),
    z.object({ action: z.literal("sign"), ...KeyCredentials, ...StringBlock }),
    z.object({ action: z.literal("sign"), ...KeyCredentials, ...Hash }),
    z.object({ action: z.literal("sign"), ...WalletCredentials, ...JsonBlock }),
    z.object({ action: z.literal("sign"), ...WalletCredentials, ...StringBlock }),
    z.object({ action: z.literal("sign"), ...WalletCredentials, ...Hash }),
  ]);
}

export type SignRequest = z.infer<ReturnType<typeof SignRequest>>;
