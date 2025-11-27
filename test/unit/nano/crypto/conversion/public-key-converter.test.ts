import {
  bytesToPublicKey,
  publicKeyToBytes,
  safeBytesToPublicKey,
  safePublicKeyToBytes,
} from "../../../../../src/nano/crypto/conversion/public-key-converter";
import { TestData } from "../../../test-data";

describe("Public key conversion utilities", () => {
  test("round-trips public keys through byte conversion", () => {
    const validPublicKeys = [
      TestData.Valid.PublicKey1(),
      TestData.Valid.PublicKey2().toLowerCase(),
      TestData.Valid.PublicKey3(),
      TestData.Valid.PublicKey4().toUpperCase(),
    ];

    for (const validPublicKey of validPublicKeys) {
      const publicKeyBytes = publicKeyToBytes(validPublicKey);
      const publicKey = bytesToPublicKey(publicKeyBytes);
      expect(publicKey.toUpperCase()).toBe(validPublicKey.toUpperCase());
    }
  });

  test("rejects invalid public keys", () => {
    const invalidPublicKeys = [
      TestData.Invalid.PublicKey.InvalidCharacters(),
      TestData.Invalid.PublicKey.TooLong(),
      TestData.Invalid.PublicKey.TooShort(),
    ];

    for (const invalidPublicKey of invalidPublicKeys) {
      expect(safePublicKeyToBytes(invalidPublicKey).success).toBe(false);
    }
  });

  test("rejects byte arrays with incorrect length", () => {
    expect(safeBytesToPublicKey(new Uint8Array([1, 2])).success).toBe(false);
  });
});
