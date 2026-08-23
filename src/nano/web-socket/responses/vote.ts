import { z } from "zod";

import { UIntString } from "../../types";
import { AccountString } from "../../types/account";
import { HashString } from "../../types/hash";
import { SignatureString } from "../../types/signature";
import { FinalVoteTimestampString, TimestampString } from "../../types/timestamp";
import { VoteType } from "../types/vote-type";

export type VoteMessage = z.infer<ReturnType<typeof VoteMessage>>;
export const VoteMessage = () =>
  z.object({
    account: AccountString(),
    signature: SignatureString(),
    sequence: TimestampString().or(FinalVoteTimestampString()),
    timestamp: TimestampString().or(FinalVoteTimestampString()),
    duration: UIntString(),
    blocks: HashString().array(),
    type: VoteType(),
  });

export type VoteResponse = z.infer<ReturnType<typeof VoteResponse>>;
export const VoteResponse = () =>
  z.object({
    topic: z.literal("vote"),
    time: TimestampString(),
    message: VoteMessage(),
  });
