import { StateBlock } from "../../../../src/nano/blocks/state-block";
import { assert } from "../../../assert";
import { TestData } from "../../test-data";

describe("StateBlock schema", () => {
  test("validates structure for state blocks", () => {
    const validStateBlocks = [
      TestData.Valid.StateBlock1(),
      TestData.Valid.StateBlock2(),
      TestData.Valid.StateBlock3(),
      TestData.Valid.StateBlock4(),
    ];
    for (const validStateBlock of validStateBlocks) {
      const result = StateBlock().safeParse(validStateBlock);
      assert(result.success);
    }
  });

  test("rejects state blocks with invalid data", () => {
    const invalidStateBlocks = [
      { ...TestData.Valid.StateBlock1(), account: TestData.Invalid.Account.ChecksumMismatch() },
      { ...TestData.Valid.StateBlock2(), balance: TestData.Invalid.RawAmount.InvalidCharacters() },
      { ...TestData.Valid.StateBlock3(), link: TestData.Invalid.Link.InvalidCharacters() },
      { ...TestData.Valid.StateBlock4(), link_as_account: TestData.Invalid.Link.InvalidCharacters() },
      { ...TestData.Valid.StateBlock1(), previous: TestData.Invalid.Hash.InvalidCharacters() },
      { ...TestData.Valid.StateBlock2(), representative: TestData.Invalid.Account.InvalidCharacters() },
      { ...TestData.Valid.StateBlock3(), signature: TestData.Invalid.Signature.InvalidCharacters() },
      { ...TestData.Valid.StateBlock4(), work: TestData.Invalid.Work.InvalidCharacters() },
    ];
    for (const invalidStateBlock of invalidStateBlocks) {
      const result = StateBlock().safeParse(invalidStateBlock);
      assert(!result.success);
    }
  });
});
