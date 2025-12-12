import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";
import { TestData } from "../../test-data";

describe("block_hash RPC integration", () => {
  test("calculates hash for JSON block input", async () => {
    const result = await Nano.RPC.block_hash(
      rpcUrl,
      {
        action: "block_hash",
        json_block: true,
        block: TestData.StateBlock(),
      },
      rpcRequestConfig
    );
    assert(result.success);
    expect(result.data.hash).toBe(TestData.StateBlockHash());
  });

  test("calculates hash for block string input", async () => {
    const result = await Nano.RPC.block_hash(
      rpcUrl,
      {
        action: "block_hash",
        json_block: false,
        block: TestData.StateBlockString(),
      },
      rpcRequestConfig
    );
    assert(result.success);
    expect(result.data.hash).toBe(TestData.StateBlockHash());
  });
});
