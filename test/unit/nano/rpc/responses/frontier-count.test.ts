import { FrontierCountResponse } from "../../../../../src/nano/rpc/responses/frontier-count";
import { assert } from "../../../../assert";

describe("FrontierCountResponse schema", () => {
  test("parses frontier count response", () => {
    const result = FrontierCountResponse().safeParse({ count: "10" });
    assert(result.success);
  });

  /*test("rejects frontier count response with non-numeric count", () => {
    const result = FrontierCountResponse().safeParse({ count: "abc" });
    assert(!result.success);
  });*/
});
