import { ElectionStatisticsResponse } from "../../../../../src/nano/rpc/responses/election-statistics";

describe("ElectionStatisticsResponse schema", () => {
  test("parses election statistics response", () => {
    const result = ElectionStatisticsResponse().safeParse({
      manual: "152",
      priority: "1",
      hinted: "0",
      optimistic: "19",
      total: "172",
      aec_utilization_percentage: "3.42",
      max_election_age: "5493",
      average_election_age: "421",
    });
    expect(result.success).toBe(true);
  });
});
