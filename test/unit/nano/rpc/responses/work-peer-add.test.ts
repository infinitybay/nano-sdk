import { WorkPeerAddResponse } from "../../../../../src/nano/rpc/responses/work-peer-add";
import { assert } from "../../../../assert";

describe("WorkPeerAddResponse schema", () => {
  test("parses work peer add response", () => {
    const result = WorkPeerAddResponse().safeParse({ success: "" });
    assert(result.success);
  });

  test("rejects work peer add response without success", () => {
    const result = WorkPeerAddResponse().safeParse({});
    assert(!result.success);
  });
});
