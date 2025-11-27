import { ElectionStatisticsRequest } from "../../../../../src/nano/rpc/requests/election-statistics";

describe("ElectionStatisticsRequest schema", () => {
  test("validates election statistics request", () => {
    const result = ElectionStatisticsRequest().safeParse({
      action: "election_statistics",
    });
    expect(result.success).toBe(true);
  });

  test("rejects election statistics request with invalid action", () => {
    const result = ElectionStatisticsRequest().safeParse({
      action: "election_statistics_invalid",
    });
    expect(result.success).toBe(false);
  });
});
