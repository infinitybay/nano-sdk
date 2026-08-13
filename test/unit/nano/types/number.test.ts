import { NumberString } from "../../../../src/nano/types/number";
import { assert } from "../../../assert";

describe("NumberString schema", () => {
  test("validates valid number strings", () => {
    const validNumbers = [
      "0",
      "1",
      "-1",
      "42",
      "-42",
      "3.14",
      "-3.14",
      "0.5",
      "-0.5",
      "10.0",
      "1e3",
      "-1e3",
      "1E6",
      "-1E-6",
      "0.0001",
      "-0.0001",
    ];
    for (const value of validNumbers) {
      expect(NumberString().parse(value)).toBe(value);
    }
  });

  test("rejects strings with leading or trailing spaces", () => {
    const invalid = [" 1", "1 ", " 1 ", "\t5", "\n3"];
    for (const value of invalid) {
      assert(!NumberString().safeParse(value).success);
    }
  });

  test("rejects empty or whitespace-only strings", () => {
    const invalid = ["", " ", "   "];
    for (const value of invalid) {
      assert(!NumberString().safeParse(value).success);
    }
  });

  test("rejects malformed numbers", () => {
    const invalid = [
      ".", // no digits
      "-.", // no digits
      "--1",
      "++1",
      "1..0",
      "3.14.15",
      "1e", // incomplete exponent
      "1e-",
      "1e+",
    ];
    for (const value of invalid) {
      assert(!NumberString().safeParse(value).success);
    }
  });

  test("rejects non-numeric strings", () => {
    const invalid = ["abc", "one", "NaNish", "ten", "null", "undefined"];
    for (const value of invalid) {
      assert(!NumberString().safeParse(value).success);
    }
  });

  test("rejects Infinity or NaN literals", () => {
    const invalid = ["Infinity", "-Infinity", "NaN"];
    for (const value of invalid) {
      assert(!NumberString().safeParse(value).success);
    }
  });
});
