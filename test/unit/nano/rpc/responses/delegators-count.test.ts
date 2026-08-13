import { DelegatorsCountResponse } from "../../../../../src/nano/rpc/responses/delegators-count";
import { assert } from "../../../../assert";

describe("DelegatorsCountResponse schema", () => {
  test("parses delegators count response", () => {
    const result = DelegatorsCountResponse().safeParse({
      count: "10",
    });
    assert(result.success);
  });

  /*test("rejects delegators count response with non-numeric count", () => {
    const result = DelegatorsCountResponse().safeParse({
      count: "abc",
    });
    assert(!result.success);
  });*/
});
