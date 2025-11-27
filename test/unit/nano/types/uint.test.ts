import { UIntBounds, UIntString } from "../../../../src/nano/types/uint";
import { UInt } from "../../../../src/nano/types/uint";

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
      expect(UInt().safeParse(value).success).toBe(false);
    }
  });

  test("rejects non-integer numbers", () => {
    const invalid = [1.5, 0.1, 3.14];
    for (const value of invalid) {
      expect(UInt().safeParse(value).success).toBe(false);
    }
  });

  test("rejects non-number types", () => {
    const invalid = ["0", "1", "-1", true, false, null, undefined];
    for (const value of invalid) {
      expect(UInt().safeParse(value).success).toBe(false);
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
      expect(UIntString().safeParse(value).success).toBe(false);
    }
  });

  test("rejects strings with leading zeros", () => {
    const invalid = ["00", "01", "0005"];
    for (const value of invalid) {
      expect(UIntString().safeParse(value).success).toBe(false);
    }
  });

  test("rejects decimal numbers", () => {
    const invalid = ["1.0", "3.14", "0.1", "10.", ".5"];
    for (const value of invalid) {
      expect(UIntString().safeParse(value).success).toBe(false);
    }
  });

  test("rejects non-numeric strings", () => {
    const invalid = ["abc", "one", "", " ", "+1", "--1"];
    for (const value of invalid) {
      expect(UIntString().safeParse(value).success).toBe(false);
    }
  });

  test("rejects Infinity or NaN literals", () => {
    const invalid = ["Infinity", "NaN"];
    for (const value of invalid) {
      expect(UIntString().safeParse(value).success).toBe(false);
    }
  });
});
