import { BlockHashResponse } from "../../../../../src/nano/rpc/responses/block-hash";
import { TestData } from "../../../test-data";

describe("BlockHashResponse schema", () => {
  test("parses block hash response", () => {
    const result = BlockHashResponse().safeParse({
      hash: TestData.Valid.Hash1(),
    });
    expect(result.success).toBe(true);
  });

  test("rejects block hash response with invalid hash", () => {
    const result = BlockHashResponse().safeParse({
      hash: TestData.Invalid.Hash.InvalidCharacters(),
    });
    expect(result.success).toBe(false);
  });
});
