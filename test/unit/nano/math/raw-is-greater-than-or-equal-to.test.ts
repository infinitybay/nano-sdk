import { rawIsGreaterThanOrEqualTo } from "../../../../src/nano/math/raw-is-greater-than-or-equal-to";
import { RawAmountStrings } from "../../../../src/nano/types/amount";
import { assert } from "../../../assert";

describe("rawIsGreaterThanOrEqualTo", () => {
  test("returns true when left is larger than right", () => {
    expect(
      rawIsGreaterThanOrEqualTo({
        left: RawAmountStrings.max(),
        right: (BigInt(RawAmountStrings.max()) - 1n).toString(),
        throwOnError: true,
      })
    ).toBe(true);
  });

  test("returns true when values are equal", () => {
    const value = (10n ** 10n).toString();
    expect(rawIsGreaterThanOrEqualTo({ left: value, right: value, throwOnError: true })).toBe(true);
  });

  test("returns false when left is smaller than right", () => {
    expect(
      rawIsGreaterThanOrEqualTo({
        left: RawAmountStrings.zero(),
        right: RawAmountStrings.max(),
        throwOnError: true,
      })
    ).toBe(false);
  });

  test("returns predicate results without throwing", () => {
    const greaterResult = rawIsGreaterThanOrEqualTo({ left: "2", right: "1" });
    assert(greaterResult.checked);
    expect(greaterResult.greaterOrEqual).toBe(true);

    const lesserResult = rawIsGreaterThanOrEqualTo({ left: "1", right: "2" });
    assert(lesserResult.checked);
    expect(lesserResult.greaterOrEqual).toBe(false);
  });

  test("returns predicate error for invalid inputs without throwing", () => {
    const leftInvalid = rawIsGreaterThanOrEqualTo({ left: "", right: RawAmountStrings.zero() });
    assert(!leftInvalid.checked);
    expect(leftInvalid.error).toBeInstanceOf(Error);

    const rightInvalid = rawIsGreaterThanOrEqualTo({ left: RawAmountStrings.zero(), right: " " });
    assert(!rightInvalid.checked);
    expect(rightInvalid.error).toBeInstanceOf(Error);
  });

  test("throws for invalid inputs when throwOnError is true", () => {
    expect(() => rawIsGreaterThanOrEqualTo({ left: "", right: RawAmountStrings.zero(), throwOnError: true })).toThrow(
      "Invalid left value."
    );
    expect(() =>
      rawIsGreaterThanOrEqualTo({ left: RawAmountStrings.zero(), right: "1.1", throwOnError: true })
    ).toThrow("Invalid right value.");
  });
});
