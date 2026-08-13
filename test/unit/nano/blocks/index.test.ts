import * as Blocks from "../../../../src/nano/blocks";
import { BlockError } from "../../../../src/nano/blocks/block-error";
import { BlockErrorCode } from "../../../../src/nano/blocks/block-error-code";

describe("Blocks index exports", () => {
  test("exposes block schema factories and creation functions", () => {
    expect(Blocks.Block).toBeDefined();
    expect(Blocks.Error).toBe(BlockError);
    expect(Blocks.ErrorCode).toBe(BlockErrorCode);
    expect(Blocks.createChangeBlock).toBeDefined();
    expect(Blocks.createOpenBlock).toBeDefined();
    expect(Blocks.createReceiveBlock).toBeDefined();
    expect(Blocks.createSendBlock).toBeDefined();
    expect(Blocks.LegacyChangeBlock).toBeDefined();
    expect(Blocks.LegacyOpenBlock).toBeDefined();
    expect(Blocks.LegacyReceiveBlock).toBeDefined();
    expect(Blocks.LegacySendBlock).toBeDefined();
    expect(Blocks.StateBlock).toBeDefined();
  });
});
