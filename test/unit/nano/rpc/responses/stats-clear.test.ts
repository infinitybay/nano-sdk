import { StatsClearResponse } from "../../../../../src/nano/rpc/responses/stats-clear";

describe("StatsClearResponse schema", () => {
  test("parses stats clear response", () => {
    const result = StatsClearResponse().safeParse({ success: "" });
    expect(result.success).toBe(true);
  });

  test("rejects stats clear response without success", () => {
    const result = StatsClearResponse().safeParse({});
    expect(result.success).toBe(false);
  });
});
