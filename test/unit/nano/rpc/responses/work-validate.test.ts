import { WorkValidateResponse } from "../../../../../src/nano/rpc/responses/work-validate";
import { TestData } from "../../../test-data";

describe("WorkValidateResponse schema", () => {
  test("parses work validate response", () => {
    const result = WorkValidateResponse().safeParse({
      valid_all: "1",
      valid_receive: "1",
      difficulty: TestData.Valid.WorkDifficulty1(),
      multiplier: "1.0",
    });
    expect(result.success).toBe(true);
  });

  test("parses work validate response with optional valid flag", () => {
    const result = WorkValidateResponse().safeParse({
      valid: "1",
      valid_all: "1",
      valid_receive: "1",
      difficulty: TestData.Valid.WorkDifficulty1(),
      multiplier: "1.0",
    });
    expect(result.success).toBe(true);
  });
});
