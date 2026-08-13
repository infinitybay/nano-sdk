import { BlockAccountResponse } from "../../../../../src/nano/rpc/responses/block-account";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("BlockAccountResponse schema", () => {
  test("parses block account response", () => {
    const result = BlockAccountResponse().safeParse({
      account: TestData.Valid.Account1(),
    });
    assert(result.success);
  });

  test("rejects block account response with invalid account", () => {
    const result = BlockAccountResponse().safeParse({
      account: TestData.Invalid.Account.InvalidCharacters(),
    });
    assert(!result.success);
  });
});
