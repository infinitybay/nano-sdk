import { LegacyChangeBlock } from "../../../../src/nano/blocks/legacy-change-block";
import { TestData } from "../../test-data";

describe("LegacyChangeBlock schema", () => {
  test("validates structure for change blocks", () => {
    const result = LegacyChangeBlock().safeParse(TestData.Valid.LegacyChangeBlock());
    expect(result.success).toBe(true);
  });

  test("rejects change blocks with invalid data", () => {
    const invalidChangeBlocks = [
      { ...TestData.Valid.LegacyChangeBlock(), previous: TestData.Invalid.Hash.InvalidCharacters() },
      { ...TestData.Valid.LegacyChangeBlock(), representative: TestData.Invalid.Account.InvalidCharacters() },
      { ...TestData.Valid.LegacyChangeBlock(), work: TestData.Invalid.Work.InvalidCharacters() },
      { ...TestData.Valid.LegacyChangeBlock(), signature: TestData.Invalid.Signature.InvalidCharacters() },
    ];
    for (const invalidChangeBlock of invalidChangeBlocks) {
      const result = LegacyChangeBlock().safeParse(invalidChangeBlock);
      expect(result.success).toBe(false);
    }
  });
});
