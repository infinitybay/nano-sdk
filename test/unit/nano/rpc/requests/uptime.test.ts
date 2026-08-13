import { UptimeRequest } from "../../../../../src/nano/rpc/requests/uptime";
import { assert } from "../../../../assert";

describe("UptimeRequest schema", () => {
  test("validates uptime request", () => {
    const result = UptimeRequest().safeParse({
      action: "uptime",
    });
    assert(result.success);
  });

  test("rejects uptime request with invalid action", () => {
    const result = UptimeRequest().safeParse({
      action: "uptime_invalud",
    });
    assert(!result.success);
  });
});
