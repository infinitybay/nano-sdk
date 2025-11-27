import { WorkCancelResponse } from "../../../../../src/nano/rpc/responses/work-cancel";

describe("WorkCancelResponse schema", () => {
  test("parses work cancel response", () => {
    const result = WorkCancelResponse().safeParse({ success: "" });
    expect(result.success).toBe(true);
  });

  test("rejects work cancel response without success", () => {
    const result = WorkCancelResponse().safeParse({});
    expect(result.success).toBe(false);
  });
});
