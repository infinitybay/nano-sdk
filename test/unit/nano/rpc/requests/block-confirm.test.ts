import { BlockConfirmRequest } from "../../../../../src/nano/rpc/requests/block-confirm";
import { TestData } from "../../../test-data";

describe("BlockConfirmRequest schema", () => {
  test("validates block confirm request", () => {
    const result = BlockConfirmRequest().safeParse({
      action: "block_confirm",
      hash: TestData.Valid.Hash1(),
    });
    expect(result.success).toBe(true);
  });

  test("rejects block confirm request with invalid hash", () => {
    const result = BlockConfirmRequest().safeParse({
      action: "block_confirm",
      hash: TestData.Invalid.Hash.InvalidCharacters(),
    });
    expect(result.success).toBe(false);
  });
});
