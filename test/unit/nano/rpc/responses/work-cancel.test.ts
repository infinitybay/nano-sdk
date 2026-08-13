import { WorkCancelResponse } from "../../../../../src/nano/rpc/responses/work-cancel";
import { assert } from "../../../../assert";

describe("WorkCancelResponse schema", () => {
  test("parses work cancel response", () => {
    const result = WorkCancelResponse().safeParse({ success: "" });
    assert(result.success);
  });

  test("rejects work cancel response without success", () => {
    const result = WorkCancelResponse().safeParse({});
    assert(!result.success);
  });
});
