import { Block } from "../../../../src/nano/blocks/block";
import { assert } from "../../../assert";
import { TestData } from "../../test-data";

describe("Block schema", () => {
  test("validates union of legacy and state blocks", () => {
    const stateResult = Block().safeParse(TestData.Valid.StateBlock1());
    assert(stateResult.success);

    const legacyChangeResult = Block().safeParse(TestData.Valid.LegacyChangeBlock());
    assert(legacyChangeResult.success);

    const legacyOpenResult = Block().safeParse(TestData.Valid.LegacyOpenBlock());
    assert(legacyOpenResult.success);

    const legacyReceiveResult = Block().safeParse(TestData.Valid.LegacyReceiveBlock());
    assert(legacyReceiveResult.success);

    const legacySendResult = Block().safeParse(TestData.Valid.LegacySendBlock());
    assert(legacySendResult.success);
  });

  test("rejects blocks with unsupported type", () => {
    const result = Block().safeParse({
      type: "unknown",
    });
    assert(!result.success);
  });
});
