import { WorkValidateResponse } from "../../../../../src/nano/rpc/responses/work-validate";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("WorkValidateResponse schema", () => {
  test("parses work validate response without valid when difficulty was omitted", () => {
    const result = WorkValidateResponse({ difficulty: false }).safeParse({
      valid_all: "1",
      valid_receive: "1",
      difficulty: TestData.Valid.WorkDifficulty1(),
      multiplier: "1.0",
    });
    assert(result.success);
    expect(result.data).not.toHaveProperty("valid");
  });

  test("parses work validate response with valid when difficulty was provided", () => {
    const result = WorkValidateResponse({ difficulty: true }).safeParse({
      valid: "1",
      valid_all: "1",
      valid_receive: "1",
      difficulty: TestData.Valid.WorkDifficulty1(),
      multiplier: "1.0",
    });
    assert(result.success);
  });

  test("requires valid when difficulty was provided", () => {
    const result = WorkValidateResponse({ difficulty: true }).safeParse({
      valid_all: "1",
      valid_receive: "1",
      difficulty: TestData.Valid.WorkDifficulty1(),
      multiplier: "1.0",
    });
    assert(!result.success);
  });
});
