import { UInt, UINT64_MAX, UInt64String, UIntBounds, UIntString } from "../../../../src/nano/types/uint";
import { assert } from "../../../assert";

describe("UInt schema", () => {
  test("validates unsigned integers at or above zero", () => {
    const validUInts = [UIntBounds.min(), 0, 1, 5, 100, 999999, UIntBounds.max()];
    for (const valid of validUInts) {
      expect(UInt().parse(valid)).toBe(valid);
    }
  });

  test("rejects negative integers", () => {
    const invalid = [-1, -5, -999999];
    for (const value of invalid) {
      assert(!UInt().safeParse(value).success);
    }
  });

  test("rejects non-integer numbers", () => {
    const invalid = [1.5, 0.1, 3.14];
    for (const value of invalid) {
      assert(!UInt().safeParse(value).success);
    }
  });

  test("rejects non-number types", () => {
    const invalid = ["0", "1", "-1", true, false, null, undefined];
    for (const value of invalid) {
      assert(!UInt().safeParse(value).success);
    }
  });
});

describe("UIntString schema", () => {
  test("validates valid unsigned integer strings", () => {
    const validUInts = ["0", "1", "42", "999999"];
    for (const value of validUInts) {
      expect(UIntString().parse(value)).toBe(value);
    }
  });

  test("rejects negative integers", () => {
    const invalid = ["-1", "-42", "-999999"];
    for (const value of invalid) {
      assert(!UIntString().safeParse(value).success);
    }
  });

  test("rejects strings with leading zeros", () => {
    const invalid = ["00", "01", "0005"];
    for (const value of invalid) {
      assert(!UIntString().safeParse(value).success);
    }
  });

  test("rejects decimal numbers", () => {
    const invalid = ["1.0", "3.14", "0.1", "10.", ".5"];
    for (const value of invalid) {
      assert(!UIntString().safeParse(value).success);
    }
  });

  test("rejects non-numeric strings", () => {
    const invalid = ["abc", "one", "", " ", "+1", "--1"];
    for (const value of invalid) {
      assert(!UIntString().safeParse(value).success);
    }
  });

  test("rejects Infinity or NaN literals", () => {
    const invalid = ["Infinity", "NaN"];
    for (const value of invalid) {
      assert(!UIntString().safeParse(value).success);
    }
  });
});

describe("UInt64String schema", () => {
  test("validates unsigned 64-bit integer strings", () => {
    const validUInt64s = ["0", "1", Number.MAX_SAFE_INTEGER.toString(), UINT64_MAX.toString()];
    for (const value of validUInt64s) {
      expect(UInt64String().parse(value)).toBe(value);
    }
  });

  test("rejects values above the unsigned 64-bit integer maximum", () => {
    assert(!UInt64String().safeParse((UINT64_MAX + 1n).toString()).success);
  });

  test.each(["-1", "00", "01", "1.5", "", "abc", "+1", "Infinity", "NaN"])(
    "rejects invalid unsigned 64-bit integer string %s",
    (value) => {
      assert(!UInt64String().safeParse(value).success);
    }
  );

  test("rejects non-string values", () => {
    for (const value of [0, 1n, true, null, undefined]) {
      assert(!UInt64String().safeParse(value).success);
    }
  });
});
