import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";

describe("unchecked_get RPC integration", () => {
  test("gets unchecked block", async () => {
    const result1 = await Nano.RPC.unchecked(
      rpcUrl,
      {
        action: "unchecked",
        count: 1,
      },
      rpcRequestConfig
    );
    assert(result1.success);
    if (result1.data.blocks && Object.keys(result1.data.blocks).length > 0) {
      const hash = Object.keys(result1.data.blocks)[0];
      const block = JSON.parse(result1.data.blocks[hash]);
      const result2 = await Nano.RPC.unchecked_get(
        rpcUrl,
        {
          action: "unchecked_get",
          hash: Object.keys(result1.data.blocks)[0],
        },
        rpcRequestConfig
      );
      assert(result2.success);
      expect(JSON.parse(result2.data.contents)).toStrictEqual(block);
    }
  });

  test("gets unchecked block as JSON", async () => {
    const result1 = await Nano.RPC.unchecked(
      rpcUrl,
      {
        action: "unchecked",
        json_block: true,
        count: 1,
      },
      rpcRequestConfig
    );
    assert(result1.success);
    if (result1.data.blocks && Object.keys(result1.data.blocks).length > 0) {
      const hash = Object.keys(result1.data.blocks)[0];
      const block = result1.data.blocks[hash];
      const result2 = await Nano.RPC.unchecked_get(
        rpcUrl,
        {
          action: "unchecked_get",
          json_block: true,
          hash: hash,
        },
        rpcRequestConfig
      );
      assert(result2.success);
      expect(result2.data.contents).toStrictEqual(block);
    }
  });
});
