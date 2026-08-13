import { ElectionStatisticsRequest } from "../../../../../src/nano/rpc/requests/election-statistics";
import { assert } from "../../../../assert";

describe("ElectionStatisticsRequest schema", () => {
  test("validates election statistics request", () => {
    const result = ElectionStatisticsRequest().safeParse({
      action: "election_statistics",
    });
    assert(result.success);
  });

  test("rejects election statistics request with invalid action", () => {
    const result = ElectionStatisticsRequest().safeParse({
      action: "election_statistics_invalid",
    });
    assert(!result.success);
  });
});
