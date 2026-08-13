import { FrontierCountRequest } from "../../../../../src/nano/rpc/requests/frontier-count";
import { assert } from "../../../../assert";

describe("FrontierCountRequest schema", () => {
  test("validates frontier count request", () => {
    const result = FrontierCountRequest().safeParse({
      action: "frontier_count",
    });
    assert(result.success);
  });

  test("rejects frontier count request with invalid action", () => {
    const result = FrontierCountRequest().safeParse({
      action: "frontier_count_invalid",
    });
    assert(!result.success);
  });
});
