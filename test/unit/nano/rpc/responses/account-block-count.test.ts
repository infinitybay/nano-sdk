import { AccountBlockCountResponse } from "../../../../../src/nano/rpc/responses/account-block-count";
import { assert } from "../../../../assert";

describe("AccountBlockCountResponse schema", () => {
  test("parses account block count response", () => {
    const result = AccountBlockCountResponse().safeParse({
      block_count: "5",
    });
    assert(result.success);
    expect(result.data.block_count).toBe(5);
  });
});
