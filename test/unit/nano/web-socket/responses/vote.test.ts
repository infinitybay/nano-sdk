import { VoteResponse } from "../../../../../src/nano/web-socket/responses/vote";
import { TestData } from "../../../test-data";

describe("VoteResponse schema", () => {
  test("validates vote response", () => {
    const result = VoteResponse().safeParse({
      topic: "vote",
      time: TestData.Valid.Timestamp1(),
      message: {
        account: TestData.Valid.Account1(),
        signature: TestData.Valid.Signature1(),
        sequence: TestData.Valid.Timestamp2(),
        timestamp: TestData.Valid.Timestamp2(),
        duration: "1",
        blocks: [TestData.Valid.Hash1(), TestData.Valid.Hash2()],
        type: "vote",
      },
    });
    expect(result.success).toBe(true);
  });

  test("rejects vote response with invalid account", () => {
    const result = VoteResponse().safeParse({
      topic: "vote",
      time: TestData.Valid.Timestamp1(),
      message: {
        account: TestData.Invalid.Account.InvalidCharacters(),
        signature: TestData.Valid.Signature1(),
        sequence: TestData.Valid.Timestamp2(),
        timestamp: TestData.Valid.Timestamp2(),
        duration: "1",
        blocks: [TestData.Valid.Hash1()],
        type: "vote",
      },
    });
    expect(result.success).toBe(false);
  });
});
