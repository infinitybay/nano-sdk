import { BlockConfirmRequest } from "../../../../../src/nano/rpc/requests/block-confirm";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("BlockConfirmRequest schema", () => {
  test("validates block confirm request", () => {
    const result = BlockConfirmRequest().safeParse({
      action: "block_confirm",
      hash: TestData.Valid.Hash1(),
    });
    assert(result.success);
  });

  test("rejects block confirm request with invalid hash", () => {
    const result = BlockConfirmRequest().safeParse({
      action: "block_confirm",
      hash: TestData.Invalid.Hash.InvalidCharacters(),
    });
    assert(!result.success);
  });
});
