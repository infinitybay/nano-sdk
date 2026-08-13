import { IntBounds, IntString } from "../../../../src/nano/types/int";
import { Int } from "../../../../src/nano/types/int";
import { assert } from "../../../assert";

describe("Int schema", () => {
  test("validates integers within safe bounds", () => {
    const validInts = [IntBounds.min(), 0, 1, -1, 42, -42, 999999, -999999, IntBounds.max()];
    for (const valid of validInts) {
      expect(Int().parse(valid)).toBe(valid);
    }
  });

  test("rejects non-integer numbers", () => {
    const invalid = [1.5, -2.7, 0.1];
    for (const value of invalid) {
      assert(!Int().safeParse(value).success);
    }
  });

  test("rejects non-number types", () => {
    const invalid = ["3", "-1", true, false, null, undefined];
    for (const value of invalid) {
      assert(!Int().safeParse(value).success);
    }
  });
});

describe("IntString schema", () => {
  test("validates valid integer strings", () => {
    const validInts = ["0", "1", "42", "999999", "-1", "-42", "-999999"];
    for (const value of validInts) {
      expect(IntString().parse(value)).toBe(value);
    }
  });

  test("rejects strings with leading zeros", () => {
    const invalid = ["00", "01", "-01", "0005"];
    for (const value of invalid) {
      assert(!IntString().safeParse(value).success);
    }
  });

  test("rejects decimal numbers", () => {
    const invalid = ["1.0", "-3.14", "0.1", "10.", ".5"];
    for (const value of invalid) {
      assert(!IntString().safeParse(value).success);
    }
  });

  test("rejects non-numeric strings", () => {
    const invalid = ["abc", "one", "", " ", "+1", "--1"];
    for (const value of invalid) {
      assert(!IntString().safeParse(value).success);
    }
  });

  test("rejects Infinity or NaN literals", () => {
    const invalid = ["Infinity", "-Infinity", "NaN"];
    for (const value of invalid) {
      assert(!IntString().safeParse(value).success);
    }
  });
});
