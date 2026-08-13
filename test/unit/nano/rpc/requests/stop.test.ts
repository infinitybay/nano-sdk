import { StopRequest } from "../../../../../src/nano/rpc/requests/stop";
import { assert } from "../../../../assert";

describe("StopRequest schema", () => {
  test("validates stop request", () => {
    const result = StopRequest().safeParse({
      action: "stop",
    });
    assert(result.success);
  });

  test("rejects stop request with invalid action", () => {
    const result = StopRequest().safeParse({
      action: "stop_invalid",
    });
    assert(!result.success);
  });
});
