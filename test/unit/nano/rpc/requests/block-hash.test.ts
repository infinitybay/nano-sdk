import { BlockHashRequest } from "../../../../../src/nano/rpc/requests/block-hash";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("BlockHashRequest schema", () => {
  test("validates block hash request with json block", () => {
    const result = BlockHashRequest().safeParse({
      action: "block_hash",
      json_block: true,
      block: TestData.Valid.StateBlock1(),
    });
    assert(result.success);
  });

  test("validates block hash request with block string", () => {
    const result = BlockHashRequest().safeParse({
      action: "block_hash",
      json_block: false,
      block: "block-string",
    });
    assert(result.success);
  });

  test("rejects block hash request with mismatched json flag", () => {
    const result = BlockHashRequest().safeParse({
      action: "block_hash",
      json_block: true,
      block: "block-string",
    });
    assert(!result.success);
  });
});
