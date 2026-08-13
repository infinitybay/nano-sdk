import { StatsRequest } from "../../../../../src/nano/rpc/requests/stats";
import { assert } from "../../../../assert";

describe("StatsRequest schema", () => {
  test("validates stats request with counters type", () => {
    const result = StatsRequest().safeParse({
      action: "stats",
      type: "counters",
    });
    assert(result.success);
  });

  test("rejects stats request with unsupported type", () => {
    const result = StatsRequest().safeParse({
      action: "stats",
      type: "other",
    });
    assert(!result.success);
  });
});
