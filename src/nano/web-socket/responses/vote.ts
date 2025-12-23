import { z } from "zod";

import { UInt } from "../../types";
import { AccountString } from "../../types/account";
import { HashString } from "../../types/hash";
import { SignatureString } from "../../types/signature";
import { TimestampString } from "../../types/timestamp";
import { VoteType } from "../types/vote-type";

export type VoteResponse = z.infer<ReturnType<typeof VoteResponse>>;
export const VoteResponse = () =>
  z.object({
    topic: z.literal("vote"),
    time: TimestampString(),
    message: z.object({
      account: AccountString(),
      signature: SignatureString(),
      sequence: TimestampString(),
      timestamp: TimestampString(),
      duration: UInt().max(255),
      blocks: HashString().array(),
      type: VoteType(),
    }),
  });
