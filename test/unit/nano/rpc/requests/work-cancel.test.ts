import { WorkCancelRequest } from "../../../../../src/nano/rpc/requests/work-cancel";
import { TestData } from "../../../test-data";

describe("WorkCancelRequest schema", () => {
  test("validates work cancel request", () => {
    const result = WorkCancelRequest().safeParse({
      action: "work_cancel",
      hash: TestData.Valid.Hash1(),
    });
    expect(result.success).toBe(true);
  });

  test("rejects work cancel request with invalid hash", () => {
    const result = WorkCancelRequest().safeParse({
      action: "work_cancel",
      hash: TestData.Invalid.Hash.InvalidCharacters(),
    });
    expect(result.success).toBe(false);
  });
});
