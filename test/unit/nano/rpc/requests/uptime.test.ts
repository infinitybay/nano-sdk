import { UptimeRequest } from "../../../../../src/nano/rpc/requests/uptime";

describe("UptimeRequest schema", () => {
  test("validates uptime request", () => {
    const result = UptimeRequest().safeParse({
      action: "uptime",
    });
    expect(result.success).toBe(true);
  });

  test("rejects uptime request with invalid action", () => {
    const result = UptimeRequest().safeParse({
      action: "uptime_invalud",
    });
    expect(result.success).toBe(false);
  });
});
