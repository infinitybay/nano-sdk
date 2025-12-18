import { rawIsLessThan } from "../../../../src/nano/math/raw-is-less-than";
import { RawAmountStrings } from "../../../../src/nano/types/amount";
import { assert } from "../../../assert";

describe("rawIsLessThan", () => {
  test("returns true when left is smaller than right", () => {
    expect(rawIsLessThan({ raw: RawAmountStrings.zero(), compareTo: "1", throwOnError: true })).toBe(true);
    expect(
      rawIsLessThan({
        raw: (BigInt(RawAmountStrings.max()) - 1n).toString(),
        compareTo: RawAmountStrings.max(),
        throwOnError: true,
      })
    ).toBe(true);
  });

  test("returns false when left is equal to or larger than right", () => {
    expect(
      rawIsLessThan({
        raw: RawAmountStrings.max(),
        compareTo: RawAmountStrings.max(),
        throwOnError: true,
      })
    ).toBe(false);
    expect(rawIsLessThan({ raw: "9", compareTo: "3", throwOnError: true })).toBe(false);
  });

  test("returns predicate results without throwing", () => {
    const lessResult = rawIsLessThan({ raw: "1", compareTo: "2", throwOnError: false });
    assert(lessResult.checked);
    expect(lessResult.less).toBe(true);

    const greaterResult = rawIsLessThan({ raw: "5", compareTo: "2", throwOnError: false });
    assert(greaterResult.checked);
    expect(greaterResult.less).toBe(false);
  });

  test("returns predicate error for invalid inputs without throwing", () => {
    const leftInvalid = rawIsLessThan({ raw: "", compareTo: RawAmountStrings.zero(), throwOnError: false });
    assert(!leftInvalid.checked);
    expect(leftInvalid.error).toBeInstanceOf(Error);

    const rightInvalid = rawIsLessThan({ raw: RawAmountStrings.zero(), compareTo: "-3", throwOnError: false });
    assert(!rightInvalid.checked);
    expect(rightInvalid.error).toBeInstanceOf(Error);
  });

  test("throws for invalid inputs when throwOnError is true", () => {
    expect(() => rawIsLessThan({ raw: "", compareTo: "0", throwOnError: true })).toThrow("Invalid raw value.");
    expect(() => rawIsLessThan({ raw: "0", compareTo: "-3", throwOnError: true })).toThrow("Invalid compareTo value.");
  });
});
