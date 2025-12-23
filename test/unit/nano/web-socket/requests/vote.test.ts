import { VoteRequest } from "../../../../../src/nano/web-socket/requests/vote";
import { TestData } from "../../../test-data";

describe("VoteRequest schema", () => {
  test("validates vote request with options", () => {
    const result = VoteRequest().safeParse({
      action: "subscribe",
      topic: "vote",
      options: {
        representatives: [TestData.Valid.Account1(), TestData.Valid.Account2()],
        include_replays: true,
        include_indeterminate: "false",
      },
    });
    expect(result.success).toBe(true);
  });

  test("rejects vote request with invalid representatives", () => {
    const result = VoteRequest().safeParse({
      action: "subscribe",
      topic: "vote",
      options: {
        representatives: [TestData.Invalid.Account.InvalidCharacters()],
      },
    });
    expect(result.success).toBe(false);
  });
});
