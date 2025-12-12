import { decodeBase32, encodeBase32 } from "../../../../../src/nano/crypto/conversion/base32-converter";
import { TestData } from "../../../test-data";

const encodedPublicKeyLength = 52;
const encodedChecksumLength = 8;

describe("Base32 conversion utilities", () => {
  test("encodes and decodes public key segments deterministically", () => {
    const validAccounts = [
      TestData.Valid.Account1(),
      TestData.Valid.Account2(),
      TestData.Valid.Account3(),
      TestData.Valid.Account4(),
    ];

    for (const validAccount of validAccounts) {
      const publicKeyStartIndex = validAccount.length - encodedPublicKeyLength - encodedChecksumLength;
      const publicKeyEndIndex = validAccount.length - encodedChecksumLength;
      const encodedPublicKey = validAccount.substring(publicKeyStartIndex, publicKeyEndIndex);
      const decodedPublicKey = decodeBase32({ encoded: encodedPublicKey, throwOnError: true });
      const encodedPublicKey2 = encodeBase32({ bytes: decodedPublicKey, throwOnError: true });
      expect(encodedPublicKey2).toBe(encodedPublicKey);
    }
  });

  test("rejects base32 strings with invalid characters", () => {
    expect(decodeBase32({ encoded: "invalid*" }).success).toBe(false);
  });
});
