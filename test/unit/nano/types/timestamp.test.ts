import { Timestamp, TimestampBounds, TimestampString } from "../../../../src/nano/types/timestamp";
import { TestData } from "../../test-data";

describe("Timestamp schema", () => {
  test("validates timestamps within allowed bounds", () => {
    const validTimestamps = [0, 1, 1234567890, TimestampBounds.max()];
    for (const validTimestamp of validTimestamps) {
      expect(Timestamp().parse(validTimestamp)).toBe(validTimestamp);
    }
  });

  test("rejects timestamps outside allowed bounds", () => {
    expect(Timestamp().safeParse(-1).success).toBe(false);
    expect(Timestamp().safeParse(TimestampBounds.max() + 1).success).toBe(false);
  });

  test("rejects non-integer timestamps", () => {
    expect(Timestamp().safeParse(1.5).success).toBe(false);
    expect(Timestamp().safeParse("1").success).toBe(false);
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
    expect(TimestampString().safeParse("-5").success).toBe(false);
    expect(TimestampString().safeParse("0001").success).toBe(false);
    expect(TimestampString().safeParse("1.5").success).toBe(false);
  });
});
