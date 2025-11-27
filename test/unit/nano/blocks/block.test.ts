import { Block } from "../../../../src/nano/blocks/block";
import { TestData } from "../../test-data";

describe("Block schema", () => {
  test("validates union of legacy and state blocks", () => {
    const stateResult = Block().safeParse(TestData.Valid.StateBlock1());
    expect(stateResult.success).toBe(true);

    const legacyChangeResult = Block().safeParse(TestData.Valid.LegacyChangeBlock());
    expect(legacyChangeResult.success).toBe(true);

    const legacyOpenResult = Block().safeParse(TestData.Valid.LegacyOpenBlock());
    expect(legacyOpenResult.success).toBe(true);

    const legacyReceiveResult = Block().safeParse(TestData.Valid.LegacyReceiveBlock());
    expect(legacyReceiveResult.success).toBe(true);

    const legacySendResult = Block().safeParse(TestData.Valid.LegacySendBlock());
    expect(legacySendResult.success).toBe(true);
  });

  test("rejects blocks with unsupported type", () => {
    const result = Block().safeParse({
      type: "unknown",
    });
    expect(result.success).toBe(false);
  });
});
