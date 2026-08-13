import { BlockCountResponse } from "../../../../../src/nano/rpc/responses/block-count";
import { assert } from "../../../../assert";

describe("BlockCountResponse schema", () => {
  test("parses block count response", () => {
    const result = BlockCountResponse().safeParse({
      count: "100",
      unchecked: "5",
      cemented: "95",
    });
    assert(result.success);
  });

  /*test("rejects block count response with non-numeric count", () => {
    const result = BlockCountResponse().safeParse({
      count: "abc",
      unchecked: "5",
      cemented: "95",
    });
    assert(!result.success);
  });*/
});
