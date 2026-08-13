import { MathError } from "../../../../src/nano/math/math-error";
import { MathErrorCode } from "../../../../src/nano/math/math-error-code";
import { expectErrorCode } from "../../../expect";

describe("MathError class", () => {
  test("preserves its code and cause", () => {
    const cause = new Error("cause");
    const error = new MathError(MathErrorCode.DivisionByZero, "failure", { cause });

    expectErrorCode(error, MathErrorCode.DivisionByZero);
    expect(error).toMatchObject({ cause, name: "MathError" });
  });
});
