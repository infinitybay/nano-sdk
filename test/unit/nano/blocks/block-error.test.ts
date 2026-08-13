import { BlockError } from "../../../../src/nano/blocks/block-error";
import { BlockErrorCode } from "../../../../src/nano/blocks/block-error-code";
import { expectErrorCode } from "../../../expect";

describe("BlockError class", () => {
  test("preserves its code and cause", () => {
    const cause = new Error("cause");
    const error = new BlockError(BlockErrorCode.InvalidCreatedBlock, "failure", { cause });

    expectErrorCode(error, BlockErrorCode.InvalidCreatedBlock);
    expect(error).toMatchObject({ cause, name: "BlockError" });
  });
});
