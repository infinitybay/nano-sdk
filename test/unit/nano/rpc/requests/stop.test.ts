import { StopRequest } from "../../../../../src/nano/rpc/requests/stop";

describe("StopRequest schema", () => {
  test("validates stop request", () => {
    const result = StopRequest().safeParse({
      action: "stop",
    });
    expect(result.success).toBe(true);
  });

  test("rejects stop request with invalid action", () => {
    const result = StopRequest().safeParse({
      action: "stop_invalid",
    });
    expect(result.success).toBe(false);
  });
});
