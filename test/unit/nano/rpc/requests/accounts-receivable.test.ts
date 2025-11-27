import { AccountsReceivableRequest } from "../../../../../src/nano/rpc/requests/accounts-receivable";
import { TestData } from "../../../test-data";

describe("AccountsReceivableRequest schema", () => {
  test("validates accounts receivable request with thresholds and flags", () => {
    const result = AccountsReceivableRequest().safeParse({
      action: "accounts_receivable",
      accounts: [TestData.Valid.Account1(), TestData.Valid.Account2()],
      count: 5,
      threshold: TestData.Valid.RawAmount1(),
      source: true,
      include_active: true,
      include_only_confirmed: true,
      sorting: true,
    });
    expect(result.success).toBe(true);
  });

  test("rejects accounts receivable request with invalid account", () => {
    const result = AccountsReceivableRequest().safeParse({
      action: "accounts_receivable",
      accounts: [TestData.Invalid.Account.InvalidCharacters()],
    });
    expect(result.success).toBe(false);
  });

  test("rejects accounts receivable request with invalid threshold", () => {
    const result = AccountsReceivableRequest().safeParse({
      action: "accounts_receivable",
      accounts: [TestData.Valid.Account1()],
      threshold: TestData.Invalid.RawAmount.InvalidCharacters(),
    });
    expect(result.success).toBe(false);
  });
});
