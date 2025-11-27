import { WorkValidateRequest } from "../../../../../src/nano/rpc/requests/work-validate";
import { TestData } from "../../../test-data";

describe("WorkValidateRequest schema", () => {
  test("validates work validate request with optional version", () => {
    const result = WorkValidateRequest().safeParse({
      action: "work_validate",
      work: TestData.Valid.Work1(),
      hash: TestData.Valid.Hash1(),
      version: "work_1",
    });
    expect(result.success).toBe(true);
  });

  test("rejects work validate request with invalid work value", () => {
    const result = WorkValidateRequest().safeParse({
      action: "work_validate",
      work: TestData.Invalid.Work.InvalidCharacters(),
      hash: TestData.Valid.Hash1(),
    });
    expect(result.success).toBe(false);
  });

  test("rejects work validate request with invalid hash", () => {
    const result = WorkValidateRequest().safeParse({
      action: "work_validate",
      work: TestData.Valid.Work1(),
      hash: TestData.Invalid.Hash.InvalidCharacters(),
    });
    expect(result.success).toBe(false);
  });
});
