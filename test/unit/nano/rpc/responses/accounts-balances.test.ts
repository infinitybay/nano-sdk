import { AccountsBalancesResponse } from "../../../../../src/nano/rpc/responses/accounts-balances";
import { TestData } from "../../../test-data";

describe("AccountsBalancesResponse schema", () => {
  test("parses balances map", () => {
    const result = AccountsBalancesResponse().safeParse({
      balances: {
        [TestData.Valid.Account1()]: {
          balance: TestData.Valid.RawAmount1(),
          pending: TestData.Valid.RawAmount2(),
          receivable: TestData.Valid.RawAmount3(),
        },
      },
    });
    expect(result.success).toBe(true);
  });

  test("rejects balances map with invalid account key", () => {
    const result = AccountsBalancesResponse().safeParse({
      balances: {
        [TestData.Invalid.Account.InvalidCharacters()]: {
          balance: TestData.Valid.RawAmount1(),
          pending: TestData.Valid.RawAmount2(),
          receivable: TestData.Valid.RawAmount3(),
        },
      },
    });
    expect(result.success).toBe(false);
  });

  test("rejects balances map with invalid balance", () => {
    const result = AccountsBalancesResponse().safeParse({
      balances: {
        [TestData.Valid.Account1()]: {
          balance: TestData.Invalid.RawAmount.InvalidCharacters(),
          pending: TestData.Valid.RawAmount2(),
          receivable: TestData.Valid.RawAmount3(),
        },
      },
    });
    expect(result.success).toBe(false);
  });
});
