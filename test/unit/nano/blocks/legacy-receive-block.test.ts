import { LegacyReceiveBlock } from "../../../../src/nano/blocks/legacy-receive-block";
import { assert } from "../../../assert";
import { TestData } from "../../test-data";

describe("LegacyReceiveBlock schema", () => {
  test("validates structure for receive blocks", () => {
    const result = LegacyReceiveBlock().safeParse(TestData.Valid.LegacyReceiveBlock());
    assert(result.success);
  });

  test("rejects receive blocks with invalid data", () => {
    const invalidReceiveBlocks = [
      { ...TestData.Valid.LegacyReceiveBlock(), previous: TestData.Invalid.Hash.InvalidCharacters() },
      { ...TestData.Valid.LegacyReceiveBlock(), source: TestData.Invalid.Hash.InvalidCharacters() },
      { ...TestData.Valid.LegacyReceiveBlock(), work: TestData.Invalid.Work.InvalidCharacters() },
      { ...TestData.Valid.LegacyReceiveBlock(), signature: TestData.Invalid.Signature.InvalidCharacters() },
    ];
    for (const invalidReceiveBlock of invalidReceiveBlocks) {
      const result = LegacyReceiveBlock().safeParse(invalidReceiveBlock);
      assert(!result.success);
    }
  });
});
