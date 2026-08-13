import { StopResponse } from "../../../../../src/nano/rpc/responses/stop";
import { assert } from "../../../../assert";

describe("StopResponse schema", () => {
  test("parses stop response", () => {
    const result = StopResponse().safeParse({ success: "" });
    assert(result.success);
  });

  test("rejects stop response without success", () => {
    const result = StopResponse().safeParse({});
    assert(!result.success);
  });
});
