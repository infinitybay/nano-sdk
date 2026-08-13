import { StatsClearRequest } from "../../../../../src/nano/rpc/requests/stats-clear";
import { assert } from "../../../../assert";

describe("StatsClearRequest schema", () => {
  test("validates stats clear request", () => {
    const result = StatsClearRequest().safeParse({
      action: "stats_clear",
    });
    assert(result.success);
  });

  test("rejects stats clear request with invalid action", () => {
    const result = StatsClearRequest().safeParse({
      action: "stats_clear_invalid",
    });
    assert(!result.success);
  });
});
