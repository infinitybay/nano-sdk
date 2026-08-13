import { BlockConfirmResponse } from "../../../../../src/nano/rpc/responses/block-confirm";
import { assert } from "../../../../assert";

describe("BlockConfirmResponse schema", () => {
  test("parses block confirm response", () => {
    const result = BlockConfirmResponse().safeParse({
      started: "1",
    });
    assert(result.success);
  });

  test("rejects block confirm response with incorrect started value", () => {
    const result = BlockConfirmResponse().safeParse({
      started: "0",
    });
    assert(!result.success);
  });
});
