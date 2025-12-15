import { rawIsLessThanOrEqualTo } from "../../../../src/nano/math/raw-is-less-than-or-equal-to";
import { RawAmountStrings } from "../../../../src/nano/types/amount";
import { assert } from "../../../assert";

describe("rawIsLessThanOrEqualTo", () => {
  test("returns true when left is smaller than right", () => {
    expect(
      rawIsLessThanOrEqualTo({
        left: RawAmountStrings.zero(),
        right: RawAmountStrings.max(),
        throwOnError: true,
      })
    ).toBe(true);
  });

  test("returns true when values are equal", () => {
    const value = (10n ** 5n).toString();
    expect(rawIsLessThanOrEqualTo({ left: value, right: value, throwOnError: true })).toBe(true);
  });

  test("returns false when left is greater than right", () => {
    expect(
      rawIsLessThanOrEqualTo({
        left: RawAmountStrings.max(),
        right: (BigInt(RawAmountStrings.max()) - 1n).toString(),
        throwOnError: true,
      })
    ).toBe(false);
  });

  test("returns predicate results without throwing", () => {
    const lessResult = rawIsLessThanOrEqualTo({ left: "1", right: "2", throwOnError: false });
    assert(lessResult.checked);
    expect(lessResult.lessOrEqual).toBe(true);

    const greaterResult = rawIsLessThanOrEqualTo({ left: "3", right: "2", throwOnError: false });
    assert(greaterResult.checked);
    expect(greaterResult.lessOrEqual).toBe(false);
  });

  test("returns predicate error for invalid inputs without throwing", () => {
    const rightInvalid = rawIsLessThanOrEqualTo({
      left: RawAmountStrings.zero(),
      right: "abc",
      throwOnError: false,
    });
    assert(!rightInvalid.checked);
    expect(rightInvalid.error).toBeInstanceOf(Error);

    const leftInvalid = rawIsLessThanOrEqualTo({
      left: " ",
      right: RawAmountStrings.zero(),
      throwOnError: false,
    });
    assert(!leftInvalid.checked);
    expect(leftInvalid.error).toBeInstanceOf(Error);
  });

  test("throws for invalid inputs when throwOnError is true", () => {
    expect(() => rawIsLessThanOrEqualTo({ left: " ", right: RawAmountStrings.zero(), throwOnError: true })).toThrow(
      "Invalid left value."
    );
    expect(() => rawIsLessThanOrEqualTo({ left: RawAmountStrings.zero(), right: "abc", throwOnError: true })).toThrow(
      "Invalid right value."
    );
  });
});
