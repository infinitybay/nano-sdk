import { FrontierCountResponse } from "../../../../../src/nano/rpc/responses/frontier-count";

describe("FrontierCountResponse schema", () => {
  test("parses frontier count response", () => {
    const result = FrontierCountResponse().safeParse({ count: "10" });
    expect(result.success).toBe(true);
  });

  /*test("rejects frontier count response with non-numeric count", () => {
    const result = FrontierCountResponse().safeParse({ count: "abc" });
    expect(result.success).toBe(false);
  });*/
});
