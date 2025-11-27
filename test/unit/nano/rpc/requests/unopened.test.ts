import { UnopenedRequest } from "../../../../../src/nano/rpc/requests/unopened";
import { TestData } from "../../../test-data";

describe("UnopenedRequest schema", () => {
  test("validates unopened request with optional filters", () => {
    const result = UnopenedRequest().safeParse({
      action: "unopened",
      account: TestData.Valid.Account1(),
      count: 2,
      threshold: TestData.Valid.RawAmount1(),
    });
    expect(result.success).toBe(true);
  });

  test("rejects unopened request with invalid account", () => {
    const result = UnopenedRequest().safeParse({
      action: "unopened",
      account: TestData.Invalid.Account.InvalidCharacters(),
    });
    expect(result.success).toBe(false);
  });

  test("rejects unopened request with invalid count", () => {
    const result = UnopenedRequest().safeParse({
      action: "unopened",
      count: -1,
    });
    expect(result.success).toBe(false);
  });

  test("rejects unopened request with invalid threshold", () => {
    const result = UnopenedRequest().safeParse({
      action: "unopened",
      threshold: TestData.Invalid.RawAmount.InvalidCharacters(),
    });
    expect(result.success).toBe(false);
  });
});
