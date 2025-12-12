import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";
import { TestData } from "../../test-data";

describe("process RPC integration", () => {
  test("processes a block asynchronously", async () => {
    const result = await Nano.RPC.process(
      rpcUrl,
      {
        action: "process",
        json_block: false,
        subtype: "open",
        block: TestData.StateBlockString(),
        async: true,
      },
      rpcRequestConfig
    );
    assert(result.success);
    expect(result.data.started).toBe("1");
  });
});
