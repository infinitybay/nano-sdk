import { BlockAccountRequest } from "../../../../../src/nano/rpc/requests/block-account";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("BlockAccountRequest schema", () => {
  test("validates block account request", () => {
    const result = BlockAccountRequest().safeParse({
      action: "block_account",
      hash: TestData.Valid.Hash1(),
    });
    assert(result.success);
  });

  test("rejects block account request with invalid hash", () => {
    const result = BlockAccountRequest().safeParse({
      action: "block_account",
      hash: TestData.Invalid.Hash.InvalidCharacters(),
    });
    assert(!result.success);
  });
});
