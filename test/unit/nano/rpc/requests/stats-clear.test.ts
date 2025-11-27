import { StatsClearRequest } from "../../../../../src/nano/rpc/requests/stats-clear";

describe("StatsClearRequest schema", () => {
  test("validates stats clear request", () => {
    const result = StatsClearRequest().safeParse({
      action: "stats_clear",
    });
    expect(result.success).toBe(true);
  });

  test("rejects stats clear request with invalid action", () => {
    const result = StatsClearRequest().safeParse({
      action: "stats_clear_invalid",
    });
    expect(result.success).toBe(false);
  });
});
