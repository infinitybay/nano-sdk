import { rawIsLessThan } from "../../../../src/nano/math/raw-is-less-than";
import { RawAmountStrings } from "../../../../src/nano/types/amount";
import { assert } from "../../../assert";

describe("rawIsLessThan", () => {
  test("returns true when left is smaller than right", () => {
    expect(rawIsLessThan({ left: RawAmountStrings.zero(), right: "1", throwOnError: true })).toBe(true);
    expect(
      rawIsLessThan({
        left: (BigInt(RawAmountStrings.max()) - 1n).toString(),
        right: RawAmountStrings.max(),
        throwOnError: true,
      })
    ).toBe(true);
  });

  test("returns false when left is equal to or larger than right", () => {
    expect(
      rawIsLessThan({
        left: RawAmountStrings.max(),
        right: RawAmountStrings.max(),
        throwOnError: true,
      })
    ).toBe(false);
    expect(rawIsLessThan({ left: "9", right: "3", throwOnError: true })).toBe(false);
  });

  test("returns predicate results without throwing", () => {
    const lessResult = rawIsLessThan({ left: "1", right: "2", throwOnError: false });
    assert(lessResult.checked);
    expect(lessResult.less).toBe(true);

    const greaterResult = rawIsLessThan({ left: "5", right: "2", throwOnError: false });
    assert(greaterResult.checked);
    expect(greaterResult.less).toBe(false);
  });

  test("returns predicate error for invalid inputs without throwing", () => {
    const leftInvalid = rawIsLessThan({ left: "", right: RawAmountStrings.zero(), throwOnError: false });
    assert(!leftInvalid.checked);
    expect(leftInvalid.error).toBeInstanceOf(Error);

    const rightInvalid = rawIsLessThan({ left: RawAmountStrings.zero(), right: "-3", throwOnError: false });
    assert(!rightInvalid.checked);
    expect(rightInvalid.error).toBeInstanceOf(Error);
  });

  test("throws for invalid inputs when throwOnError is true", () => {
    expect(() => rawIsLessThan({ left: "", right: "0", throwOnError: true })).toThrow("Invalid left value.");
    expect(() => rawIsLessThan({ left: "0", right: "-3", throwOnError: true })).toThrow("Invalid right value.");
  });
});
