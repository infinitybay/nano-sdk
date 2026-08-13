import { VoteType } from "../../../../../src/nano/web-socket/types/vote-type";
import { assert } from "../../../../assert";

describe("VoteType schema", () => {
  test("validates known vote types", () => {
    expect(VoteType().parse("vote")).toBe("vote");
    expect(VoteType().parse("replay")).toBe("replay");
    expect(VoteType().parse("ignored")).toBe("ignored");
  });

  test("rejects unknown vote types", () => {
    assert(!VoteType().safeParse("unknown").success);
  });
});
