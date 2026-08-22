import { BlockCountResponse } from "../../../../../src/nano/rpc/responses/block-count";
import { assert } from "../../../../assert";

describe("BlockCountResponse schema", () => {
  test("parses block count response", () => {
    const result = BlockCountResponse().safeParse({
      count: "100",
      unchecked: "5",
      cemented: "95",
    });
    assert(result.success);
  });

  test("parses block count response with pruning statistics", () => {
    const result = BlockCountResponse().safeParse({
      count: "100",
      unchecked: "5",
      cemented: "95",
      full: "90",
      pruned: "10",
    });
    assert(result.success);
  });

  test("rejects block count response with non-numeric pruning statistics", () => {
    const result = BlockCountResponse().safeParse({
      count: "100",
      unchecked: "5",
      cemented: "95",
      full: "abc",
      pruned: "10",
    });
    assert(!result.success);
  });
});
