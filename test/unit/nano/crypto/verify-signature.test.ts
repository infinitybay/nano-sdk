import { verifySignature } from "../../../../src/nano/crypto/verify-signature";
import { assert } from "../../../assert";
import { TestData } from "../../test-data";

describe("verifySignature function", () => {
  test("validates signatures for matching hash and public key", () => {
    const data = [
      { hash: TestData.Valid.Hash1(), publicKey: TestData.Valid.PublicKey1(), signature: TestData.Valid.Signature1() },
      { hash: TestData.Valid.Hash2(), publicKey: TestData.Valid.PublicKey2(), signature: TestData.Valid.Signature2() },
      { hash: TestData.Valid.Hash3(), publicKey: TestData.Valid.PublicKey3(), signature: TestData.Valid.Signature3() },
      { hash: TestData.Valid.Hash4(), publicKey: TestData.Valid.PublicKey4(), signature: TestData.Valid.Signature4() },
    ];
    for (let i = 0; i < data.length; i++) {
      const result = verifySignature(data[i]);
      expect(result).toEqual({ checked: true, validSignature: true });
    }
  });

  test("rejects mismatched signatures", () => {
    const data = [
      { hash: TestData.Valid.Hash1(), publicKey: TestData.Valid.PublicKey1(), signature: TestData.Valid.Signature4() },
      { hash: TestData.Valid.Hash2(), publicKey: TestData.Valid.PublicKey2(), signature: TestData.Valid.Signature3() },
      { hash: TestData.Valid.Hash3(), publicKey: TestData.Valid.PublicKey3(), signature: TestData.Valid.Signature2() },
      { hash: TestData.Valid.Hash4(), publicKey: TestData.Valid.PublicKey4(), signature: TestData.Valid.Signature1() },
    ];
    for (let i = 0; i < data.length; i++) {
      const result = verifySignature(data[i]);
      assert(result.checked);
      expect(result.validSignature).toBe(false);
    }
  });
});
