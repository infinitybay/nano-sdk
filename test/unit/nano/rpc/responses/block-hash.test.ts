import { BlockHashResponse } from "../../../../../src/nano/rpc/responses/block-hash";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("BlockHashResponse schema", () => {
  test("parses block hash response", () => {
    const result = BlockHashResponse().safeParse({
      hash: TestData.Valid.Hash1(),
    });
    assert(result.success);
  });

  test("rejects block hash response with invalid hash", () => {
    const result = BlockHashResponse().safeParse({
      hash: TestData.Invalid.Hash.InvalidCharacters(),
    });
    assert(!result.success);
  });
});
