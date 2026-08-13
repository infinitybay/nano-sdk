import { LegacySendBlock } from "../../../../src/nano/blocks/legacy-send-block";
import { assert } from "../../../assert";
import { TestData } from "../../test-data";

describe("LegacySendBlock schema", () => {
  test("validates structure for send blocks", () => {
    const result = LegacySendBlock().safeParse(TestData.Valid.LegacySendBlock());
    assert(result.success);
  });

  test("rejects send blocks with invalid data", () => {
    const invalidSendBlocks = [
      { ...TestData.Valid.LegacySendBlock(), previous: TestData.Invalid.Hash.InvalidCharacters() },
      { ...TestData.Valid.LegacySendBlock(), destination: TestData.Invalid.Account.InvalidCharacters() },
      { ...TestData.Valid.LegacySendBlock(), balance: TestData.Invalid.RawAmount.InvalidCharacters() },
      { ...TestData.Valid.LegacySendBlock(), work: TestData.Invalid.Work.InvalidCharacters() },
      { ...TestData.Valid.LegacySendBlock(), signature: TestData.Invalid.Signature.InvalidCharacters() },
    ];
    for (const invalidSendBlock of invalidSendBlocks) {
      const result = LegacySendBlock().safeParse(invalidSendBlock);
      assert(!result.success);
    }
  });
});
