import { BlockAccountResponse } from "../../../../../src/nano/rpc/responses/block-account";
import { TestData } from "../../../test-data";

describe("BlockAccountResponse schema", () => {
  test("parses block account response", () => {
    const result = BlockAccountResponse().safeParse({
      account: TestData.Valid.Account1(),
    });
    expect(result.success).toBe(true);
  });

  test("rejects block account response with invalid account", () => {
    const result = BlockAccountResponse().safeParse({
      account: TestData.Invalid.Account.InvalidCharacters(),
    });
    expect(result.success).toBe(false);
  });
});
