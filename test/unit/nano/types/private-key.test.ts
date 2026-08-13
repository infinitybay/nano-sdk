import { PrivateKeyString, PrivateKeyStrings } from "../../../../src/nano/types/private-key";
import { assert } from "../../../assert";
import { TestData } from "../../test-data";

describe("PrivateKeyString schema", () => {
  test("validates parsing of valid private keys", () => {
    const validPrivateKeys = [
      TestData.Valid.PrivateKey1(),
      TestData.Valid.PrivateKey2(),
      TestData.Valid.PrivateKey3(),
      TestData.Valid.PrivateKey4(),
    ];
    for (const validPrivateKey of validPrivateKeys) {
      expect(PrivateKeyString().parse(validPrivateKey)).toBe(validPrivateKey);
    }
  });

  test("accepts uppercase and lowercase inputs", () => {
    expect(PrivateKeyString().parse(TestData.Valid.PrivateKey1().toUpperCase())).toBe(
      TestData.Valid.PrivateKey1().toUpperCase()
    );
    expect(PrivateKeyString().parse(TestData.Valid.PrivateKey1().toLowerCase())).toBe(
      TestData.Valid.PrivateKey1().toLowerCase()
    );
  });

  test("ensures zero private key constant has expected length", () => {
    expect(PrivateKeyStrings.zero()).toHaveLength(64);
  });

  test("rejects private keys with invalid characters", () => {
    assert(!PrivateKeyString().safeParse(TestData.Invalid.PrivateKey.InvalidCharacters()).success);
  });

  test("rejects private keys exceeding length limit", () => {
    assert(!PrivateKeyString().safeParse(TestData.Invalid.PrivateKey.TooLong()).success);
  });

  test("rejects private keys below length requirement", () => {
    assert(!PrivateKeyString().safeParse(TestData.Invalid.PrivateKey.TooShort()).success);
  });
});
