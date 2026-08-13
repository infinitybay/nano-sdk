import { PredicateResult, Result } from "../../../../src/nano/types/result";
import { assert } from "../../../assert";

class TestError extends Error {
  readonly code = "TEST_ERROR";
}

describe("Result type", () => {
  test("represents successful result variant", () => {
    const success: Result<string> = { success: true, data: "result" };
    assert(success.success);
    expect(success.data).toBe("result");
  });

  test("represents failure result variant", () => {
    const error = new TestError("fail");
    const failure: Result<number, TestError> = { success: false, error };
    assert(!failure.success);
    expect(failure.error.code).toBe("TEST_ERROR");
  });

  test("supports typed predicate errors", () => {
    const failure: PredicateResult<"checked", "valid", TestError> = {
      checked: false,
      error: new TestError("fail"),
    };

    expect(failure.checked).toBe(false);
    expect(failure.error.code).toBe("TEST_ERROR");
  });
});

describe("Result", () => {
  test("creates a successful result", () => {
    const result: Result<string, TestError> = Result.ok("result");

    expect(result).toEqual({ success: true, data: "result" });
  });

  test("creates a failed result", () => {
    const error = new TestError("fail");
    const result: Result<string, TestError> = Result.err(error);

    expect(result).toEqual({ success: false, error });
  });

  test("unwraps successful results by default and in throwing mode", () => {
    const result = Result.ok("result");

    expect(Result.unwrap(result)).toBe("result");
    expect(Result.unwrap(result, true)).toBe("result");
  });

  test("returns the complete result in non-throwing mode", () => {
    const result = Result.ok("result");

    expect(Result.unwrap(result, false)).toBe(result);
  });

  test("throws failed results by default and in throwing mode", () => {
    const error = new TestError("fail");
    const result = Result.err(error);

    expect(() => Result.unwrap(result)).toThrow(error);
    expect(() => Result.unwrap(result, true)).toThrow(error);
  });

  test("returns failed results in non-throwing mode", () => {
    const result = Result.err(new TestError("fail"));

    expect(Result.unwrap(result, false)).toBe(result);
  });

  test("preserves compile-time return types", () => {
    const result: Result<string, TestError> = Result.ok("result");
    const defaultValue: string = Result.unwrap(result);
    const throwingValue: string = Result.unwrap(result, true);
    const nonThrowingValue: Result<string, TestError> = Result.unwrap(result, false);

    expect(defaultValue).toBe("result");
    expect(throwingValue).toBe("result");
    expect(nonThrowingValue).toBe(result);
  });
});
