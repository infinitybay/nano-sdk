import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";
import { TestData } from "../../test-data";

describe("successors RPC integration", () => {
  test("returns block successors", async () => {
    const result = await Nano.RPC.successors(
      rpcUrl,
      {
        action: "successors",
        block: TestData.GenesisBlockHash(),
        count: 3,
      },
      rpcRequestConfig
    );
    assert(result.success);
    assert(result.data.blocks);
    expect(result.data.blocks).toHaveLength(3);
  });
});
