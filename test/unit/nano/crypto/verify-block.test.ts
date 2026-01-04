import { verifyBlock } from "../../../../src/nano/crypto/verify-block";
import { assert } from "../../../assert";
import { TestData } from "../../test-data";

describe("verifyBlock function", () => {
  test("validates signatures for matching state blocks and public keys", () => {
    const data = [
      { block: TestData.Valid.StateBlock1(), publicKey: TestData.Valid.PublicKey1() },
      { block: TestData.Valid.StateBlock2(), publicKey: TestData.Valid.PublicKey2() },
      { block: TestData.Valid.StateBlock3(), publicKey: TestData.Valid.PublicKey3() },
      { block: TestData.Valid.StateBlock4(), publicKey: TestData.Valid.PublicKey4() },
    ];
    for (let i = 0; i < data.length; i++) {
      const result = verifyBlock({ ...data[i], throwOnError: false });
      assert(result.checked);
      expect(result.validBlock).toBe(true);
    }
    for (let i = 0; i < data.length; i++) {
      const result = verifyBlock({ block: data[i].block, throwOnError: false });
      assert(result.checked);
      expect(result.validBlock).toBe(true);
    }
  });

  test("validates signatures for epoch state blocks", () => {
    const data = [
      { block: TestData.Valid.Epoch.V1.StateBlock1(), publicKey: TestData.Valid.Epoch.V1.Signer.PublicKey() },
      { block: TestData.Valid.Epoch.V2.StateBlock1(), publicKey: TestData.Valid.Epoch.V2.Signer.PublicKey() },
    ];
    for (let i = 0; i < data.length; i++) {
      const result = verifyBlock({ ...data[i], throwOnError: false });
      assert(result.checked);
      expect(result.validBlock).toBe(true);
    }
  });

  test("rejects mismatched link_as_accounts", () => {
    const data = [
      {
        block: { ...TestData.Valid.StateBlock1(), link_as_account: TestData.Valid.Account4() },
        publicKey: TestData.Valid.PublicKey1(),
      },
      {
        block: { ...TestData.Valid.StateBlock2(), link_as_account: TestData.Valid.Account3() },
        publicKey: TestData.Valid.PublicKey2(),
      },
      {
        block: { ...TestData.Valid.StateBlock3(), link_as_account: TestData.Valid.Account2() },
        publicKey: TestData.Valid.PublicKey3(),
      },
      {
        block: { ...TestData.Valid.StateBlock4(), link_as_account: TestData.Valid.Account1() },
        publicKey: TestData.Valid.PublicKey4(),
      },
    ];
    for (let i = 0; i < data.length; i++) {
      const result = verifyBlock({ ...data[i], throwOnError: false });
      assert(result.checked);
      expect(result.validBlock).toBe(false);
    }
  });

  test("rejects mismatched signatures", () => {
    const data = [
      {
        block: { ...TestData.Valid.StateBlock1(), signature: TestData.Valid.Signature4() },
        publicKey: TestData.Valid.PublicKey1(),
      },
      {
        block: { ...TestData.Valid.StateBlock2(), signature: TestData.Valid.Signature3() },
        publicKey: TestData.Valid.PublicKey2(),
      },
      {
        block: { ...TestData.Valid.StateBlock3(), signature: TestData.Valid.Signature2() },
        publicKey: TestData.Valid.PublicKey3(),
      },
      {
        block: { ...TestData.Valid.StateBlock4(), signature: TestData.Valid.Signature1() },
        publicKey: TestData.Valid.PublicKey4(),
      },
    ];
    for (let i = 0; i < data.length; i++) {
      const result = verifyBlock({ ...data[i], throwOnError: false });
      assert(result.checked);
      expect(result.validBlock).toBe(false);
    }
  });
});
