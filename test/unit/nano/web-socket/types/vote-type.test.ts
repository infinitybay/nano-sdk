import { VoteType } from "../../../../../src/nano/web-socket/types/vote-type";

describe("VoteType schema", () => {
  test("validates known vote types", () => {
    expect(VoteType().parse("vote")).toBe("vote");
    expect(VoteType().parse("replay")).toBe("replay");
    expect(VoteType().parse("ignored")).toBe("ignored");
  });

  test("rejects unknown vote types", () => {
    expect(VoteType().safeParse("unknown").success).toBe(false);
  });
});
