import { z } from "zod";

const UINT64_MIN = 0n;
const UINT64_MAX = 18446744073709551615n;
const UINT64_MAX_STRING = "18446744073709551615";

const TIMESTAMP_REGEX = /^(0|[1-9]\d*)$/;
const TIMESTAMP_STRING_MAX_LENGTH = UINT64_MAX_STRING.length;

export const TimestampBounds = {
  min: () => UINT64_MIN,
  max: () => UINT64_MAX,
};

export type Timestamp = z.infer<ReturnType<typeof Timestamp>>;
export const Timestamp = () => z.bigint().min(TimestampBounds.min()).max(TimestampBounds.max());

export type TimestampString = z.infer<ReturnType<typeof TimestampString>>;
export const TimestampString = () =>
  z
    .string()
    .regex(TIMESTAMP_REGEX, "Invalid timestamp")
    .refine(
      (val) =>
        val.length <= TIMESTAMP_STRING_MAX_LENGTH &&
        TIMESTAMP_REGEX.test(val) &&
        Timestamp().safeParse(BigInt(val)).success,
      { message: "Invalid timestamp" }
    );

export type FinalVoteTimestamp = z.infer<ReturnType<typeof FinalVoteTimestamp>>;
export const FinalVoteTimestamp = () => z.literal(UINT64_MAX);

export type FinalVoteTimestampString = z.infer<ReturnType<typeof FinalVoteTimestampString>>;
export const FinalVoteTimestampString = () => z.literal(UINT64_MAX_STRING);

export const Timestamps = {
  FinalVote: (): FinalVoteTimestamp => FinalVoteTimestamp().parse(UINT64_MAX),
  FinalVoteString: (): FinalVoteTimestampString => FinalVoteTimestampString().parse(UINT64_MAX_STRING),
};
