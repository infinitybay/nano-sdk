import { Topic } from "../../../../../src/nano/web-socket/types/topic";

describe("Topic schema", () => {
  test("validates allowed topics", () => {
    expect(Topic().parse("active_difficulty")).toBe("active_difficulty");
    expect(Topic().parse("bootstrap")).toBe("bootstrap");
    expect(Topic().parse("confirmation")).toBe("confirmation");
    expect(Topic().parse("new_unconfirmed_block")).toBe("new_unconfirmed_block");
    expect(Topic().parse("work")).toBe("work");
  });

  test("rejects unsupported topics", () => {
    expect(Topic().safeParse("other").success).toBe(false);
  });
});
