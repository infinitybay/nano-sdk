import { Nano } from "../../../../src";
import { verifySignature } from "../../../../src/nano/crypto";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";
import { TestData } from "../../test-data";

describe("sign RPC integration", () => {
  test("signs a JSON state block and returns signature with block", async () => {
    const result = await Nano.RPC.sign(
      rpcUrl,
      {
        action: "sign",
        json_block: true,
        key: TestData.KeySet().PrivateKey(),
        block: TestData.StateBlock(),
      },
      rpcRequestConfig
    );
    assert(result.success);
    expect(
      verifySignature({
        hash: TestData.StateBlockHash(),
        publicKey: TestData.KeySet().PublicKey(),
        signature: result.data.signature,
        throwOnError: true,
      })
    ).toBe(true);
  });

  // Disabled, because signing by block hash could be disabled
  xtest("signs using a hash reference without returning block contents", async () => {
    const result = await Nano.RPC.sign(
      rpcUrl,
      {
        action: "sign",
        json_block: true,
        key: TestData.KeySet().PrivateKey(),
        hash: TestData.StateBlockHash(),
      },
      rpcRequestConfig
    );
    assert(result.success);
    expect(
      verifySignature({
        hash: TestData.StateBlockHash(),
        publicKey: TestData.KeySet().PublicKey(),
        signature: result.data.signature,
        throwOnError: true,
      })
    ).toBe(true);
  });
});
