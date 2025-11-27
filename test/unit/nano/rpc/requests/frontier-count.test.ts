import { FrontierCountRequest } from "../../../../../src/nano/rpc/requests/frontier-count";

describe("FrontierCountRequest schema", () => {
  test("validates frontier count request", () => {
    const result = FrontierCountRequest().safeParse({
      action: "frontier_count",
    });
    expect(result.success).toBe(true);
  });

  test("rejects frontier count request with invalid action", () => {
    const result = FrontierCountRequest().safeParse({
      action: "frontier_count_invalid",
    });
    expect(result.success).toBe(false);
  });
});
