import { bytesToPrivateKey, privateKeyToBytes } from "../../../../../src/nano/crypto/conversion/private-key-converter";
import { TestData } from "../../../test-data";

describe("Private key conversion utilities", () => {
  test("round-trips private keys through byte conversion", () => {
    const validPrivateKeys = [
      TestData.Valid.PrivateKey1(),
      TestData.Valid.PrivateKey2().toLowerCase(),
      TestData.Valid.PrivateKey3(),
      TestData.Valid.PrivateKey4().toUpperCase(),
    ];

    for (const validPrivateKey of validPrivateKeys) {
      const privateKeyBytes = privateKeyToBytes({ privateKey: validPrivateKey, throwOnError: true });
      const privateKey = bytesToPrivateKey({ privateKeyBytes, throwOnError: true });
      expect(privateKey.toUpperCase()).toBe(validPrivateKey.toUpperCase());
    }
  });

  test("rejects invalid private keys", () => {
    const invalidPrivateKeys = [
      TestData.Invalid.PrivateKey.InvalidCharacters(),
      TestData.Invalid.PrivateKey.TooLong(),
      TestData.Invalid.PrivateKey.TooShort(),
    ];

    for (const invalidPrivateKey of invalidPrivateKeys) {
      expect(privateKeyToBytes({ privateKey: invalidPrivateKey, throwOnError: false }).success).toBe(false);
    }
  });

  test("rejects byte arrays with incorrect length", () => {
    expect(bytesToPrivateKey({ privateKeyBytes: new Uint8Array([1, 2]), throwOnError: false }).success).toBe(false);
  });
});
