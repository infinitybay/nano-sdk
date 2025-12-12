import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";

describe("key_create RPC integration", () => {
  test("creates a new key pair", async () => {
    const result = await Nano.RPC.key_create(
      rpcUrl,
      {
        action: "key_create",
      },
      rpcRequestConfig
    );
    assert(result.success);
    expect(result.data.public).toBe(
      Nano.Crypto.derivePublicKeyFromPrivateKey({ privateKey: result.data.private, throwOnError: true })
    );
    expect(result.data.account).toBe(
      Nano.Crypto.deriveAccountFromPublicKey({ publicKey: result.data.public, throwOnError: true })
    );
  });
});
