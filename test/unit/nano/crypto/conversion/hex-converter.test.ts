import { bytesToHex, hexToBytes, safeHexToBytes } from "../../../../../src/nano/crypto/conversion/hex-converter";
import { TestData } from "../../../test-data";

describe("Hex conversion utilities", () => {
  test("round-trips hex strings through byte conversion", () => {
    const validHexs = [
      TestData.Valid.Hash1(),
      TestData.Valid.Hash2().toLowerCase(),
      TestData.Valid.Hash3(),
      TestData.Valid.Hash4().toUpperCase(),
      "aBcDeF",
    ];

    for (const validHex of validHexs) {
      const hexBytes = hexToBytes(validHex);
      const hex = bytesToHex(hexBytes);
      expect(hex.toUpperCase()).toBe(validHex.toUpperCase());
    }
  });

  test("rejects invalid hex strings", () => {
    const invalidHexs = [TestData.Invalid.Hash.InvalidCharacters(), "ZZZ"];

    for (const invalidHex of invalidHexs) {
      expect(safeHexToBytes(invalidHex).success).toBe(false);
    }
  });
});
