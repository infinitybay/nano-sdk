import { z } from "zod";

import { UINT64_MAX, UINT64_MAX_STRING, UINT64_MIN, UInt64String } from "./uint";

export const TimestampBounds = {
  min: () => UINT64_MIN,
  max: () => UINT64_MAX,
};

export type Timestamp = z.infer<ReturnType<typeof Timestamp>>;
export const Timestamp = () => z.bigint().min(TimestampBounds.min()).max(TimestampBounds.max());

export type TimestampString = z.infer<ReturnType<typeof TimestampString>>;
export const TimestampString = () => UInt64String();

export type FinalVoteTimestamp = z.infer<ReturnType<typeof FinalVoteTimestamp>>;
export const FinalVoteTimestamp = () => z.literal(UINT64_MAX);

export type FinalVoteTimestampString = z.infer<ReturnType<typeof FinalVoteTimestampString>>;
export const FinalVoteTimestampString = () => z.literal(UINT64_MAX_STRING);

export const Timestamps = {
  FinalVote: (): FinalVoteTimestamp => FinalVoteTimestamp().parse(UINT64_MAX),
  FinalVoteString: (): FinalVoteTimestampString => FinalVoteTimestampString().parse(UINT64_MAX_STRING),
};
