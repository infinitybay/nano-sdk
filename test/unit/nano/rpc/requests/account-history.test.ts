import { AccountHistoryRequest } from "../../../../../src/nano/rpc/requests/account-history";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("AccountHistoryRequest schema", () => {
  test("validates account history request with account, filters, and options", () => {
    const result = AccountHistoryRequest().safeParse({
      action: "account_history",
      account: TestData.Valid.Account1(),
      account_filter: [TestData.Valid.Account2()],
      count: 10,
      include_linked_account: true,
      offset: 2,
      raw: true,
      reverse: true,
    });
    assert(result.success);
  });

  test("validates account history request with head, filters, and options", () => {
    const result = AccountHistoryRequest().safeParse({
      action: "account_history",
      account_filter: [TestData.Valid.Account2()],
      count: 10,
      head: TestData.Valid.Hash1(),
      include_linked_account: true,
      offset: 2,
      raw: true,
      reverse: true,
    });
    assert(result.success);
  });

  test("rejects account history request with both account and head", () => {
    const result = AccountHistoryRequest().safeParse({
      action: "account_history",
      account: TestData.Valid.Account1(),
      count: 1,
      head: TestData.Valid.Hash1(),
    });
    assert(!result.success);
  });

  test("rejects account history request without account or head", () => {
    const result = AccountHistoryRequest().safeParse({
      action: "account_history",
      count: 1,
    });
    assert(!result.success);
  });

  test("rejects account history request with invalid head hash", () => {
    const result = AccountHistoryRequest().safeParse({
      action: "account_history",
      count: 1,
      head: TestData.Invalid.Hash.InvalidCharacters(),
    });
    assert(!result.success);
  });
});
