import { PublicKeyString, PublicKeyStrings } from "../../../../src/nano/types/public-key";
import { TestData } from "../../test-data";

describe("PublicKeyString schema", () => {
  test("validates parsing of valid public keys", () => {
    const validPublicKeys = [
      TestData.Valid.PublicKey1(),
      TestData.Valid.PublicKey2(),
      TestData.Valid.PublicKey3(),
      TestData.Valid.PublicKey4(),
    ];
    for (const validPublicKey of validPublicKeys) {
      expect(PublicKeyString().parse(validPublicKey)).toBe(validPublicKey);
    }
  });

  test("accepts uppercase and lowercase inputs", () => {
    expect(PublicKeyString().parse(TestData.Valid.PublicKey1().toUpperCase())).toBe(
      TestData.Valid.PublicKey1().toUpperCase()
    );
    expect(PublicKeyString().parse(TestData.Valid.PublicKey1().toLowerCase())).toBe(
      TestData.Valid.PublicKey1().toLowerCase()
    );
  });

  test("ensures zero public key constant has expected length", () => {
    expect(PublicKeyStrings.zero()).toHaveLength(64);
  });

  test("rejects public keys with invalid characters", () => {
    expect(PublicKeyString().safeParse(TestData.Invalid.PublicKey.InvalidCharacters()).success).toBe(false);
  });

  test("rejects public keys exceeding length limit", () => {
    expect(PublicKeyString().safeParse(TestData.Invalid.PublicKey.TooLong()).success).toBe(false);
  });

  test("rejects public keys below length requirement", () => {
    expect(PublicKeyString().safeParse(TestData.Invalid.PublicKey.TooShort()).success).toBe(false);
  });
});
