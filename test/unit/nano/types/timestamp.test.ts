import { Timestamp, TimestampBounds, TimestampString } from "../../../../src/nano/types/timestamp";
import { assert } from "../../../assert";
import { TestData } from "../../test-data";

describe("Timestamp schema", () => {
  test("validates timestamps within allowed bounds", () => {
    const validTimestamps = [0, 1, 1234567890, TimestampBounds.max()];
    for (const validTimestamp of validTimestamps) {
      expect(Timestamp().parse(validTimestamp)).toBe(validTimestamp);
    }
  });

  test("rejects timestamps outside allowed bounds", () => {
    assert(!Timestamp().safeParse(-1).success);
    assert(!Timestamp().safeParse(TimestampBounds.max() + 1).success);
  });

  test("rejects non-integer timestamps", () => {
    assert(!Timestamp().safeParse(1.5).success);
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
    ];
    for (const validTimestamp of validTimestamps) {
      expect(TimestampString().parse(validTimestamp)).toBe(validTimestamp);
    }
  });

  test("rejects invalid timestamp formats", () => {
    assert(!TimestampString().safeParse("-5").success);
    assert(!TimestampString().safeParse("0001").success);
    assert(!TimestampString().safeParse("1.5").success);
  });
});
