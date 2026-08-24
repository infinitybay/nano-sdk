import { StatsResponse } from "../../../../../src/nano/rpc/responses/stats";
import { assert } from "../../../../assert";

describe("StatsResponse schema", () => {
  test("parses counters stats response", () => {
    const schema = StatsResponse({ type: "counters" });
    const result = schema.safeParse({
      type: "counters",
      created: "0",
      entries: [{ time: "0", type: "t", detail: "d", dir: "in", value: "1" }],
      stat_duration_seconds: "5",
    });
    assert(result.success);
  });

  test("parses counters stats response with empty entries", () => {
    const schema = StatsResponse({ type: "counters" });
    const result = schema.safeParse({
      type: "counters",
      created: "0",
      entries: "",
      stat_duration_seconds: "5",
    });
    assert(result.success);
  });

  test("parses samples stats response", () => {
    const schema = StatsResponse({ type: "samples" });
    const result = schema.safeParse({
      type: "samples",
      created: "0",
      entries: [{ time: "0", sample: "s", min: "1", max: "2", values: ["1", "2"] }],
      stat_duration_seconds: "5",
    });
    assert(result.success);
  });

  test("parses samples stats response with empty entries", () => {
    const schema = StatsResponse({ type: "samples" });
    const result = schema.safeParse({
      type: "samples",
      created: "0",
      entries: "",
      stat_duration_seconds: "5",
    });
    assert(result.success);
  });

  test("parses samples stats response with empty sample values", () => {
    const schema = StatsResponse({ type: "samples" });
    const result = schema.safeParse({
      type: "samples",
      created: "0",
      entries: [{ time: "0", sample: "s", min: "0", max: "0", values: "" }],
      stat_duration_seconds: "5",
    });
    assert(result.success);
  });

  test("rejects non-empty strings for collection fields", () => {
    const countersSchema = StatsResponse({ type: "counters" });
    const samplesSchema = StatsResponse({ type: "samples" });

    expect(
      countersSchema.safeParse({
        type: "counters",
        created: "0",
        entries: "invalid",
        stat_duration_seconds: "5",
      }).success
    ).toBe(false);
    expect(
      samplesSchema.safeParse({
        type: "samples",
        created: "0",
        entries: [{ time: "0", sample: "s", min: "0", max: "0", values: "invalid" }],
        stat_duration_seconds: "5",
      }).success
    ).toBe(false);
  });

  test("parses objects stats response", () => {
    const schema = StatsResponse({ type: "objects" });
    const result = schema.safeParse({
      node: {},
    });
    assert(result.success);
  });

  test("parses database stats response with uint64 values", () => {
    const schema = StatsResponse({ type: "database" });
    const result = schema.safeParse({
      branch_pages: "18446744073709551615",
      depth: "18446744073709551615",
      entries: "18446744073709551615",
      leaf_pages: "18446744073709551615",
      overflow_pages: "18446744073709551615",
      page_size: "18446744073709551615",
    });
    assert(result.success);
  });
});
