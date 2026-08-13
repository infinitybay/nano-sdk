import * as Nano from "../../../src/nano";
import { BlockError } from "../../../src/nano/blocks/block-error";
import { BlockErrorCode } from "../../../src/nano/blocks/block-error-code";
import { bytesToWork } from "../../../src/nano/crypto/conversion/work-converter";
import { CryptoError } from "../../../src/nano/crypto/crypto-error";
import { CryptoErrorCode } from "../../../src/nano/crypto/crypto-error-code";
import { MathError } from "../../../src/nano/math/math-error";
import { MathErrorCode } from "../../../src/nano/math/math-error-code";
import { PostError } from "../../../src/nano/rpc/http/post-error";
import { PostErrorCode } from "../../../src/nano/rpc/http/post-error-code";
import { assert } from "../../assert";
import { TestData } from "../test-data";

describe("Nano namespace exports", () => {
  test("exposes grouped Nano namespaces", () => {
    expect(Nano.Blocks).toBeDefined();
    expect(Nano.Blocks.Error).toBe(BlockError);
    expect(Nano.Blocks.ErrorCode).toBe(BlockErrorCode);
    expect(Nano.Crypto).toBeDefined();
    expect(Nano.Crypto.Error).toBe(CryptoError);
    expect(Nano.Crypto.ErrorCode).toBe(CryptoErrorCode);
    expect(Nano.Math.Error).toBe(MathError);
    expect(Nano.Math.ErrorCode).toBe(MathErrorCode);
    expect(Nano.RPC).toBeDefined();
    expect(Nano.RPC.Error).toBe(PostError);
    expect(Nano.RPC.ErrorCode).toBe(PostErrorCode);
    expect(Nano.Types).toBeDefined();
    expect(Nano.WebSocket).toBeDefined();
  });

  test("preserves domain error identity through namespace aliases", () => {
    const error = new CryptoError(CryptoErrorCode.InvalidLink, "Invalid link.");

    expect(error).toBeInstanceOf(Nano.Crypto.Error);
    expect(Nano.Crypto.ErrorCode.InvalidLink).toBe(CryptoErrorCode.InvalidLink);
    expect(Nano.Blocks.ErrorCode.InvalidAmount).toBe(BlockErrorCode.InvalidAmount);
    expect(Nano.Math.ErrorCode.NegativeResult).toBe(MathErrorCode.NegativeResult);
    expect(Nano.RPC.ErrorCode.NodeError).toBe(PostErrorCode.NodeError);
    expect(globalThis.Error).not.toBe(Nano.Crypto.Error);
  });

  test("exposes operation parameter and result types through their domain namespaces", () => {
    const blockParams: Nano.Blocks.CreateReceiveBlockParams = {
      amount: "1",
      frontierBlock: TestData.Valid.StateBlock1(),
      sendBlock: TestData.Valid.StateBlock2(),
    };
    const converterParams: Nano.Crypto.PrivateKeyToBytesParams = {
      privateKey: TestData.Valid.PrivateKey1(),
    };
    const converterResult: Nano.Crypto.BytesToWorkResult = bytesToWork({
      workBytes: new Uint8Array(8),
      throwOnError: false,
    });

    expect(blockParams.amount).toBe("1");
    expect(converterParams.privateKey).toBe(TestData.Valid.PrivateKey1());
    assert(converterResult.success);
  });
});
