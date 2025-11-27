import * as Blocks from "../../../../src/nano/blocks";

describe("Blocks index exports", () => {
  test("exposes block schema factories", () => {
    expect(Blocks.Block).toBeDefined();
    expect(Blocks.LegacyChangeBlock).toBeDefined();
    expect(Blocks.LegacyOpenBlock).toBeDefined();
    expect(Blocks.LegacyReceiveBlock).toBeDefined();
    expect(Blocks.LegacySendBlock).toBeDefined();
    expect(Blocks.StateBlock).toBeDefined();
  });
});
