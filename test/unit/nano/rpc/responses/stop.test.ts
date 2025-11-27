import { StopResponse } from "../../../../../src/nano/rpc/responses/stop";

describe("StopResponse schema", () => {
  test("parses stop response", () => {
    const result = StopResponse().safeParse({ success: "" });
    expect(result.success).toBe(true);
  });

  test("rejects stop response without success", () => {
    const result = StopResponse().safeParse({});
    expect(result.success).toBe(false);
  });
});
