import { WorkCancelRequest } from "../../../../../src/nano/rpc/requests/work-cancel";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("WorkCancelRequest schema", () => {
  test("validates work cancel request", () => {
    const result = WorkCancelRequest().safeParse({
      action: "work_cancel",
      hash: TestData.Valid.Hash1(),
    });
    assert(result.success);
  });

  test("rejects work cancel request with invalid hash", () => {
    const result = WorkCancelRequest().safeParse({
      action: "work_cancel",
      hash: TestData.Invalid.Hash.InvalidCharacters(),
    });
    assert(!result.success);
  });
});
