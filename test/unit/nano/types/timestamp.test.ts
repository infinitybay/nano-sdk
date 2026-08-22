import {
  FinalVoteTimestamp,
  FinalVoteTimestampString,
  Timestamp,
  TimestampBounds,
  Timestamps,
  TimestampString,
} from "../../../../src/nano/types/timestamp";
import { assert } from "../../../assert";
import { TestData } from "../../test-data";

describe("Timestamp schema", () => {
  test("validates timestamps within allowed bounds", () => {
    const validTimestamps = [0n, 1n, 1234567890n, TimestampBounds.max()];
    for (const validTimestamp of validTimestamps) {
      expect(Timestamp().parse(validTimestamp)).toBe(validTimestamp);
    }
  });

  test("rejects timestamps outside allowed bounds", () => {
    assert(!Timestamp().safeParse(-1n).success);
    assert(!Timestamp().safeParse(TimestampBounds.max() + 1n).success);
  });

  test("rejects number and string timestamps", () => {
    assert(!Timestamp().safeParse(1).success);
    assert(!Timestamp().safeParse("1").success);
  });
});

describe("TimestampString schema", () => {
  test("validates parsing of valid timestamps", () => {
    const validTimestamps = [
      TestData.Valid.Timestamp1(),
      TestData.Valid.Timestamp2(),
      TestData.Valid.Timestamp3(),
      TestData.Valid.Timestamp4(),
      Timestamps.FinalVoteString(),
    ];
    for (const validTimestamp of validTimestamps) {
      expect(TimestampString().parse(validTimestamp)).toBe(validTimestamp);
    }
  });

  test("rejects invalid timestamp formats", () => {
    assert(!TimestampString().safeParse("-5").success);
    assert(!TimestampString().safeParse("0001").success);
    assert(!TimestampString().safeParse("1.5").success);
    assert(!TimestampString().safeParse((TimestampBounds.max() + 1n).toString()).success);
  });
});

describe("final vote timestamp schemas", () => {
  test("validate the maximum uint64 value", () => {
    const finalVoteTimestamp: FinalVoteTimestamp = Timestamps.FinalVote();
    const finalVoteTimestampString: FinalVoteTimestampString = Timestamps.FinalVoteString();

    expect(finalVoteTimestamp).toBe(18446744073709551615n);
    expect(FinalVoteTimestamp().parse(finalVoteTimestamp)).toBe(finalVoteTimestamp);
    expect(FinalVoteTimestampString().parse(finalVoteTimestampString)).toBe(finalVoteTimestampString);
  });

  test("reject values other than the maximum uint64 value", () => {
    assert(!FinalVoteTimestamp().safeParse(Timestamps.FinalVote() - 1n).success);
    assert(!FinalVoteTimestampString().safeParse((Timestamps.FinalVote() - 1n).toString()).success);
  });
});
