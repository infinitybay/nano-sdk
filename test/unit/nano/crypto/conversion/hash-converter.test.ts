import { bytesToHash, hashToBytes } from "../../../../../src/nano/crypto/conversion/hash-converter";
import { TestData } from "../../../test-data";

describe("Hash conversion utilities", () => {
  test("round-trips hashes through byte conversion", () => {
    const validHashs = [TestData.Valid.Hash1(), TestData.Valid.Hash2(), TestData.Valid.Hash3(), TestData.Valid.Hash4()];

    for (const validHash of validHashs) {
      const hashBytes = hashToBytes({ hash: validHash, throwOnError: true });
      const hash = bytesToHash({ hashBytes, throwOnError: true });
      expect(hash).toBe(validHash);
    }
  });

  test("rejects invalid hashes", () => {
    const invalidHashs = [
      TestData.Invalid.Hash.InvalidCharacters(),
      TestData.Invalid.Hash.TooLong(),
      TestData.Invalid.Hash.TooShort(),
    ];

    for (const invalidHash of invalidHashs) {
      expect(hashToBytes({ hash: invalidHash }).success).toBe(false);
    }
  });

  test("rejects byte arrays with incorrect length", () => {
    expect(bytesToHash({ hashBytes: new Uint8Array([1, 2]) }).success).toBe(false);
  });
});
