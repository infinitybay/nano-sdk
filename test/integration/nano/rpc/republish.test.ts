import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";
import { TestData } from "../../test-data";

describe("republish RPC integration", () => {
  test("republishes a block", async () => {
    const result = await Nano.RPC.Safe.republish(
      rpcUrl,
      {
        action: "republish",
        hash: TestData.BurnBlockHash(),
        count: 1,
        sources: 1,
        destinations: 1,
      },
      rpcRequestConfig
    );
    assert(result.success);
    expect(result.data.blocks).toHaveLength(1);
    expect(result.data.blocks[0]).toBe(TestData.BurnBlockHash());
  });
});
