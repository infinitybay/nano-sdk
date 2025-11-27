import { StatsResponse } from "../../../../../src/nano/rpc/responses/stats";

describe("StatsResponse schema", () => {
  test("parses counters stats response", () => {
    const schema = StatsResponse({ type: "counters" });
    const result = schema.safeParse({
      type: "counters",
      created: "0",
      entries: [{ time: "0", type: "t", detail: "d", dir: "in", value: "1" }],
      stat_duration_seconds: "5",
    });
    expect(result.success).toBe(true);
  });

  test("parses samples stats response", () => {
    const schema = StatsResponse({ type: "samples" });
    const result = schema.safeParse({
      type: "samples",
      created: "0",
      entries: [{ time: "0", sample: "s", min: "1", max: "2", values: ["1", "2"] }],
      stat_duration_seconds: "5",
    });
    expect(result.success).toBe(true);
  });

  test("parses objects stats response", () => {
    const schema = StatsResponse({ type: "objects" });
    const result = schema.safeParse({
      node: {},
    });
    expect(result.success).toBe(true);
  });

  test("parses database stats response", () => {
    const schema = StatsResponse({ type: "database" });
    const result = schema.safeParse({
      branch_pages: "1",
      depth: "1",
      entries: "1",
      leaf_pages: "1",
      overflow_pages: "1",
      page_size: "1",
    });
    expect(result.success).toBe(true);
  });
});
