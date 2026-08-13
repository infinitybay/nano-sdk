import { VoteRequest } from "../../../../../src/nano/web-socket/requests/vote";
import { assert } from "../../../../assert";
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
    assert(result.success);
  });

  test("rejects vote request with invalid representatives", () => {
    const result = VoteRequest().safeParse({
      action: "subscribe",
      topic: "vote",
      options: {
        representatives: [TestData.Invalid.Account.InvalidCharacters()],
      },
    });
    assert(!result.success);
  });
});
