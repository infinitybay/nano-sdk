import { StatsRequest } from "../../../../../src/nano/rpc/requests/stats";

describe("StatsRequest schema", () => {
  test("validates stats request with counters type", () => {
    const result = StatsRequest().safeParse({
      action: "stats",
      type: "counters",
    });
    expect(result.success).toBe(true);
  });

  test("rejects stats request with unsupported type", () => {
    const result = StatsRequest().safeParse({
      action: "stats",
      type: "other",
    });
    expect(result.success).toBe(false);
  });
});
