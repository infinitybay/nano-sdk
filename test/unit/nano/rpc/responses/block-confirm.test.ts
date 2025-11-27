import { BlockConfirmResponse } from "../../../../../src/nano/rpc/responses/block-confirm";

describe("BlockConfirmResponse schema", () => {
  test("parses block confirm response", () => {
    const result = BlockConfirmResponse().safeParse({
      started: "1",
    });
    expect(result.success).toBe(true);
  });

  test("rejects block confirm response with incorrect started value", () => {
    const result = BlockConfirmResponse().safeParse({
      started: "0",
    });
    expect(result.success).toBe(false);
  });
});
