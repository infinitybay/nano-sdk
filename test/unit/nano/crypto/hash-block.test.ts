import { hashBlock } from "../../../../src/nano/crypto/hash-block";
import { TestData } from "../../test-data";

describe("hashBlock function", () => {
  test("computes expected hashes for valid state blocks", () => {
    const data = [
      { hash: TestData.Valid.Hash1(), block: TestData.Valid.StateBlock1() },
      { hash: TestData.Valid.Hash2(), block: TestData.Valid.StateBlock2() },
      { hash: TestData.Valid.Hash3(), block: TestData.Valid.StateBlock3() },
      { hash: TestData.Valid.Hash4(), block: TestData.Valid.StateBlock4() },
    ];
    for (let i = 0; i < data.length; i++) {
      expect(hashBlock({ ...data[i].block, throwOnError: true }).toUpperCase()).toBe(data[i].hash.toUpperCase());
    }
  });

  test("rejects hashing when state block is invalid", () => {
    const invalidBlocks = [
      TestData.Valid.StateBlock1(),
      TestData.Valid.StateBlock2(),
      TestData.Valid.StateBlock3(),
      TestData.Valid.StateBlock4(),
      TestData.Valid.StateBlock4(),
    ];
    invalidBlocks[0].account = TestData.Invalid.Account.ChecksumMismatch();
    invalidBlocks[1].previous = TestData.Invalid.Hash.InvalidCharacters();
    invalidBlocks[2].representative = TestData.Invalid.Account.InvalidCharacters();
    invalidBlocks[3].balance = TestData.Invalid.RawAmount.InvalidCharacters();
    invalidBlocks[4].link = TestData.Invalid.Link.TooLong();
    for (let i = 0; i < invalidBlocks.length; i++) {
      expect(hashBlock({ ...invalidBlocks[i], throwOnError: false }).success).toBe(false);
    }
  });
});
