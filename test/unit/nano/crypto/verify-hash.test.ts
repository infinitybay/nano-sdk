import { verifyHash } from "../../../../src/nano/crypto/verify-hash";
import { assert } from "../../../assert";
import { TestData } from "../../test-data";

describe("verifyHash function", () => {
  test("validates hashes for matching state blocks", () => {
    const data = [
      { hash: TestData.Valid.Hash1(), block: TestData.Valid.StateBlock1() },
      { hash: TestData.Valid.Hash2(), block: TestData.Valid.StateBlock2() },
      { hash: TestData.Valid.Hash3(), block: TestData.Valid.StateBlock3() },
      { hash: TestData.Valid.Hash4(), block: TestData.Valid.StateBlock4() },
    ];
    for (let i = 0; i < data.length; i++) {
      const result = verifyHash(data[i]);
      expect(result).toEqual({ checked: true, validHash: true });
    }
  });

  test("rejects hashes that do not match state block", () => {
    const data = [
      { hash: TestData.Valid.Hash4(), block: TestData.Valid.StateBlock1() },
      { hash: TestData.Valid.Hash3(), block: TestData.Valid.StateBlock2() },
      { hash: TestData.Valid.Hash2(), block: TestData.Valid.StateBlock3() },
      { hash: TestData.Valid.Hash1(), block: TestData.Valid.StateBlock4() },
    ];
    for (let i = 0; i < data.length; i++) {
      const result = verifyHash(data[i]);
      assert(result.checked);
      expect(result.validHash).toBe(false);
    }
  });
});
