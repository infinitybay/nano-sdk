import { Result } from "../../../../src/nano/types/result";

describe("Result type", () => {
  test("represents successful result variant", () => {
    const success: Result<string> = { success: true, data: "result" };
    expect(success.success).toBe(true);
    expect(success.data).toBe("result");
  });

  test("represents failure result variant", () => {
    const error = new Error("fail");
    const failure: Result<number> = { success: false, error };
    expect(failure.success).toBe(false);
    expect(failure.error).toBe(error);
  });
});
