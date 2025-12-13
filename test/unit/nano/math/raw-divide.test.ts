import { rawDivide } from "../../../../src/nano/math/raw-divide";
import { RawAmountStrings } from "../../../../src/nano/types/amount";
import { assert } from "../../../assert";

describe("rawDivide", () => {
  test("divides raw values exactly", () => {
    expect(rawDivide({ dividend: "10", divisor: "2", throwOnError: true })).toBe("5");

    const quotient = (BigInt(RawAmountStrings.max()) / 5n).toString();
    expect(rawDivide({ dividend: RawAmountStrings.max(), divisor: "5", throwOnError: true })).toBe(quotient);
  });

  test("returns success result in non-throwing mode", () => {
    const result = rawDivide({ dividend: "20", divisor: "4" });
    assert(result.success);
    expect(result.data).toBe("5");
  });

  test("throws when divisor is zero", () => {
    expect(() => rawDivide({ dividend: "10", divisor: "0", throwOnError: true })).toThrow(
      "Division by zero is not allowed."
    );
  });

  test("throws when division leaves a remainder", () => {
    expect(() => rawDivide({ dividend: "10", divisor: "3", throwOnError: true })).toThrow(
      "Resulting amount must be an integer."
    );
  });

  test("returns failure result instead of throwing when errors occur without throwOnError", () => {
    expect(rawDivide({ dividend: "10", divisor: "0" }).success).toBe(false);
    expect(rawDivide({ dividend: "10", divisor: "3" }).success).toBe(false);
  });

  test("rejects invalid inputs", () => {
    expect(() => rawDivide({ dividend: "", divisor: "1", throwOnError: true })).toThrow("Invalid dividend value.");
    expect(() => rawDivide({ dividend: "1", divisor: "abc", throwOnError: true })).toThrow("Invalid divisor value.");

    const result = rawDivide({ dividend: "abc", divisor: "1" });
    expect(result.success).toBe(false);
  });
});
