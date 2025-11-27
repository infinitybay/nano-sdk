import { BlockAccountRequest } from "../../../../../src/nano/rpc/requests/block-account";
import { TestData } from "../../../test-data";

describe("BlockAccountRequest schema", () => {
  test("validates block account request", () => {
    const result = BlockAccountRequest().safeParse({
      action: "block_account",
      hash: TestData.Valid.Hash1(),
    });
    expect(result.success).toBe(true);
  });

  test("rejects block account request with invalid hash", () => {
    const result = BlockAccountRequest().safeParse({
      action: "block_account",
      hash: TestData.Invalid.Hash.InvalidCharacters(),
    });
    expect(result.success).toBe(false);
  });
});
