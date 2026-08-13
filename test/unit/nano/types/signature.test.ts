import { SignatureString, SignatureStrings } from "../../../../src/nano/types/signature";
import { assert } from "../../../assert";
import { TestData } from "../../test-data";

describe("SignatureString schema", () => {
  test("validates parsing of valid signatures", () => {
    const validSignatures = [
      TestData.Valid.Signature1(),
      TestData.Valid.Signature2(),
      TestData.Valid.Signature3(),
      TestData.Valid.Signature4(),
    ];
    for (const validSignature of validSignatures) {
      expect(SignatureString().parse(validSignature)).toBe(validSignature);
    }
  });

  test("accepts uppercase and lowercase inputs", () => {
    expect(SignatureString().parse(TestData.Valid.Signature1().toUpperCase())).toBe(
      TestData.Valid.Signature1().toUpperCase()
    );
    expect(SignatureString().parse(TestData.Valid.Signature1().toLowerCase())).toBe(
      TestData.Valid.Signature1().toLowerCase()
    );
  });

  test("ensures zero signature constant has expected length", () => {
    expect(SignatureStrings.zero()).toHaveLength(128);
  });

  test("rejects signatures with invalid characters", () => {
    assert(!SignatureString().safeParse(TestData.Invalid.Signature.InvalidCharacters()).success);
  });

  test("rejects signatures exceeding length limit", () => {
    assert(!SignatureString().safeParse(TestData.Invalid.Signature.TooLong()).success);
  });

  test("rejects signatures below length requirement", () => {
    assert(!SignatureString().safeParse(TestData.Invalid.Signature.TooShort()).success);
  });
});
