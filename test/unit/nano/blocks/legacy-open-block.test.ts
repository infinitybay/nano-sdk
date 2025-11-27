import { LegacyOpenBlock } from "../../../../src/nano/blocks/legacy-open-block";
import { TestData } from "../../test-data";

describe("LegacyOpenBlock schema", () => {
  test("validates structure for open blocks", () => {
    const result = LegacyOpenBlock().safeParse(TestData.Valid.LegacyOpenBlock());
    expect(result.success).toBe(true);
  });

  test("rejects open blocks with invalid data", () => {
    const invalidOpenBlocks = [
      { ...TestData.Valid.LegacyOpenBlock(), source: TestData.Invalid.Hash.InvalidCharacters() },
      { ...TestData.Valid.LegacyOpenBlock(), representative: TestData.Invalid.Account.InvalidCharacters() },
      { ...TestData.Valid.LegacyOpenBlock(), account: TestData.Invalid.Account.InvalidCharacters() },
      { ...TestData.Valid.LegacyOpenBlock(), work: TestData.Invalid.Work.InvalidCharacters() },
      { ...TestData.Valid.LegacyOpenBlock(), signature: TestData.Invalid.Signature.InvalidCharacters() },
    ];
    for (const invalidOpenBlock of invalidOpenBlocks) {
      const result = LegacyOpenBlock().safeParse(invalidOpenBlock);
      expect(result.success).toBe(false);
    }
  });
});
