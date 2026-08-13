import { signHash } from "../../../../src/nano/crypto/sign-hash";
import { assert } from "../../../assert";
import { TestData } from "../../test-data";

describe("signHash function", () => {
  test("produces expected signatures for valid hashes and private keys", () => {
    const validHashes = [
      TestData.Valid.Hash1(),
      TestData.Valid.Hash2(),
      TestData.Valid.Hash3(),
      TestData.Valid.Hash4(),
    ];
    const privateKeys = [
      TestData.Valid.PrivateKey1(),
      TestData.Valid.PrivateKey2(),
      TestData.Valid.PrivateKey3(),
      TestData.Valid.PrivateKey4(),
    ];
    const expectedSignatures = [
      TestData.Valid.Signature1(),
      TestData.Valid.Signature2(),
      TestData.Valid.Signature3(),
      TestData.Valid.Signature4(),
    ];
    for (let i = 0; i < validHashes.length; i++) {
      expect(signHash({ hash: validHashes[i], privateKey: privateKeys[i], throwOnError: true })).toBe(
        expectedSignatures[i]
      );
    }
  });

  test("rejects signing when hash or private key is invalid", () => {
    const data = [
      { hash: TestData.Invalid.Hash.InvalidCharacters(), privateKey: TestData.Valid.PrivateKey1() },
      { hash: TestData.Valid.Hash1(), privateKey: TestData.Invalid.PrivateKey.InvalidCharacters() },
      { hash: TestData.Invalid.Hash.TooLong(), privateKey: TestData.Valid.PrivateKey2() },
      { hash: TestData.Valid.Hash2(), privateKey: TestData.Invalid.PrivateKey.TooLong() },
      { hash: TestData.Invalid.Hash.TooShort(), privateKey: TestData.Valid.PrivateKey3() },
      { hash: TestData.Valid.Hash3(), privateKey: TestData.Invalid.PrivateKey.TooShort() },
    ];
    for (let i = 0; i < data.length; i++) {
      assert(!signHash({ hash: data[i].hash, privateKey: data[i].privateKey, throwOnError: false }).success);
    }
  });
});
