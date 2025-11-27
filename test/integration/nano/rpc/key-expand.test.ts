import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";
import { TestData } from "../../test-data";

describe("key_expand RPC integration", () => {
  test("expands a private key", async () => {
    const result = await Nano.RPC.Safe.key_expand(
      rpcUrl,
      {
        action: "key_expand",
        key: TestData.KeySet().PrivateKey(),
      },
      rpcRequestConfig
    );
    assert(result.success);
    expect(result.data.account).toBe(TestData.KeySet().Account());
    expect(result.data.private).toBe(TestData.KeySet().PrivateKey());
    expect(result.data.public).toBe(TestData.KeySet().PublicKey());
  });
});
