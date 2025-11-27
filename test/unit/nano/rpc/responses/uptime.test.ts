import { UptimeResponse } from "../../../../../src/nano/rpc/responses/uptime";

describe("UptimeResponse schema", () => {
  test("parses uptime response", () => {
    const result = UptimeResponse().safeParse({ seconds: "100" });
    expect(result.success).toBe(true);
  });

  /*test("rejects uptime response with non-numeric seconds", () => {
    const result = UptimeResponse().safeParse({ seconds: "100" });
    expect(result.success).toBe(false);
  });*/
});
