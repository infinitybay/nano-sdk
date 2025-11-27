import { BlockCountResponse } from "../../../../../src/nano/rpc/responses/block-count";

describe("BlockCountResponse schema", () => {
  test("parses block count response", () => {
    const result = BlockCountResponse().safeParse({
      count: "100",
      unchecked: "5",
      cemented: "95",
    });
    expect(result.success).toBe(true);
  });

  /*test("rejects block count response with non-numeric count", () => {
    const result = BlockCountResponse().safeParse({
      count: "abc",
      unchecked: "5",
      cemented: "95",
    });
    expect(result.success).toBe(false);
  });*/
});
