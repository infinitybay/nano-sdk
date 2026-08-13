import { UptimeResponse } from "../../../../../src/nano/rpc/responses/uptime";
import { assert } from "../../../../assert";

describe("UptimeResponse schema", () => {
  test("parses uptime response", () => {
    const result = UptimeResponse().safeParse({ seconds: "100" });
    assert(result.success);
  });

  /*test("rejects uptime response with non-numeric seconds", () => {
    const result = UptimeResponse().safeParse({ seconds: "100" });
    assert(!result.success);
  });*/
});
