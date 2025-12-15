import { rawMinus } from "../../../../src/nano/math/raw-minus";
import { RawAmountStrings } from "../../../../src/nano/types/amount";
import { assert } from "../../../assert";

describe("rawMinus", () => {
  test("subtracts raw values correctly", () => {
    expect(rawMinus({ raw: "10", subtrahend: "3", throwOnError: true })).toBe("7");
    expect(rawMinus({ raw: "1", subtrahend: "1", throwOnError: true })).toBe("0");
  });

  test("returns success result in non-throwing mode", () => {
    const result = rawMinus({ raw: "5", subtrahend: "2", throwOnError: false });
    assert(result.success);
    expect(result.data).toBe("3");
  });

  test("handles subtraction at the minimum boundary", () => {
    expect(() => rawMinus({ raw: RawAmountStrings.min(), subtrahend: "1", throwOnError: true })).toThrow(
      "Resulting amount may not be less than"
    );
  });

  test("returns failure result when subtraction would underflow without throwing", () => {
    const result = rawMinus({ raw: RawAmountStrings.min(), subtrahend: "1", throwOnError: false });
    expect(result.success).toBe(false);
  });

  test("rejects invalid inputs", () => {
    expect(() => rawMinus({ raw: "", subtrahend: "1", throwOnError: true })).toThrow("Invalid raw value.");
    expect(() => rawMinus({ raw: "1", subtrahend: "-5", throwOnError: true })).toThrow("Invalid subtrahend value.");

    const result = rawMinus({ raw: "abc", subtrahend: "1", throwOnError: false });
    expect(result.success).toBe(false);
  });
});
