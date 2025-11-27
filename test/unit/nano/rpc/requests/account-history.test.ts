import { AccountHistoryRequest } from "../../../../../src/nano/rpc/requests/account-history";
import { TestData } from "../../../test-data";

describe("AccountHistoryRequest schema", () => {
  test("validates account history request with filters and options", () => {
    const result = AccountHistoryRequest().safeParse({
      action: "account_history",
      account: TestData.Valid.Account1(),
      account_filter: [TestData.Valid.Account2()],
      count: 10,
      head: TestData.Valid.Hash1(),
      include_linked_account: true,
      offset: 2,
      raw: true,
      reverse: true,
    });
    expect(result.success).toBe(true);
  });

  test("rejects account history request with invalid head hash", () => {
    const result = AccountHistoryRequest().safeParse({
      action: "account_history",
      account: TestData.Valid.Account1(),
      count: 1,
      head: TestData.Invalid.Hash.InvalidCharacters(),
    });
    expect(result.success).toBe(false);
  });
});
