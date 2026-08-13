import { HashString, HashStrings } from "../../../../src/nano/types/hash";
import { assert } from "../../../assert";
import { TestData } from "../../test-data";

describe("HashString schema", () => {
  test("validates parsing of valid hashes", () => {
    const validHashes = [
      TestData.Valid.Hash1(),
      TestData.Valid.Hash2(),
      TestData.Valid.Hash3(),
      TestData.Valid.Hash4(),
    ];
    for (const validHash of validHashes) {
      expect(HashString().parse(validHash)).toBe(validHash);
    }
  });

  test("accepts uppercase and lowercase inputs", () => {
    expect(HashString().parse(TestData.Valid.Hash1().toUpperCase())).toBe(TestData.Valid.Hash1().toUpperCase());
    expect(HashString().parse(TestData.Valid.Hash1().toLowerCase())).toBe(TestData.Valid.Hash1().toLowerCase());
  });

  test("ensures zero hash constant has expected length", () => {
    expect(HashStrings.zero()).toHaveLength(64);
  });

  test("rejects hashes with invalid characters", () => {
    assert(!HashString().safeParse(TestData.Invalid.Hash.InvalidCharacters()).success);
  });

  test("rejects hashes exceeding length limit", () => {
    assert(!HashString().safeParse(TestData.Invalid.Hash.TooLong()).success);
  });

  test("rejects hashes below length requirement", () => {
    assert(!HashString().safeParse(TestData.Invalid.Hash.TooShort()).success);
  });
});
