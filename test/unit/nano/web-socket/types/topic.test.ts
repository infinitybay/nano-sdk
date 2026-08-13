import { Topic } from "../../../../../src/nano/web-socket/types/topic";
import { assert } from "../../../../assert";

describe("Topic schema", () => {
  test("validates allowed topics", () => {
    expect(Topic().parse("bootstrap")).toBe("bootstrap");
    expect(Topic().parse("confirmation")).toBe("confirmation");
    expect(Topic().parse("new_unconfirmed_block")).toBe("new_unconfirmed_block");
    expect(Topic().parse("started_election")).toBe("started_election");
    expect(Topic().parse("stopped_election")).toBe("stopped_election");
    expect(Topic().parse("telemetry")).toBe("telemetry");
    expect(Topic().parse("vote")).toBe("vote");
    expect(Topic().parse("work")).toBe("work");
  });

  test("rejects unsupported topics", () => {
    assert(!Topic().safeParse("other").success);
  });
});
