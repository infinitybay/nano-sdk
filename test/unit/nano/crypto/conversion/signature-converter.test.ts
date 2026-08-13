import { bytesToSignature, signatureToBytes } from "../../../../../src/nano/crypto/conversion/signature-converter";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("Signature conversion utilities", () => {
  test("round-trips signatures through byte conversion", () => {
    const validSignatures = [
      TestData.Valid.Signature1(),
      TestData.Valid.Signature2().toLowerCase(),
      TestData.Valid.Signature3(),
      TestData.Valid.Signature4().toUpperCase(),
    ];

    for (const validSignature of validSignatures) {
      const signatureBytes = signatureToBytes({ signature: validSignature, throwOnError: true });
      const signature = bytesToSignature({ signatureBytes, throwOnError: true });
      expect(signature.toUpperCase()).toBe(validSignature.toUpperCase());
    }
  });

  test("rejects invalid signatures", () => {
    const invalidSignatures = [
      TestData.Invalid.Signature.InvalidCharacters(),
      TestData.Invalid.Signature.TooLong(),
      TestData.Invalid.Signature.TooShort(),
    ];

    for (const invalidSignature of invalidSignatures) {
      assert(!signatureToBytes({ signature: invalidSignature, throwOnError: false }).success);
    }
  });

  test("rejects byte arrays with incorrect length", () => {
    assert(!bytesToSignature({ signatureBytes: new Uint8Array([1, 2]), throwOnError: false }).success);
  });
});
