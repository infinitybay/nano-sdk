import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";

describe("key_create RPC integration", () => {
  test("creates a new key pair", async () => {
    const result = await Nano.RPC.Safe.key_create(
      rpcUrl,
      {
        action: "key_create",
      },
      rpcRequestConfig
    );
    assert(result.success);
    expect(result.data.public).toBe(Nano.Crypto.derivePublicKeyFromPrivateKey(result.data.private));
    expect(result.data.account).toBe(Nano.Crypto.deriveAccountFromPublicKey(result.data.public));
  });
});
