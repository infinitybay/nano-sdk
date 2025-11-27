import { AccountBalanceResponse } from "../../../../../src/nano/rpc/responses/account-balance";
import { TestData } from "../../../test-data";

describe("AccountBalanceResponse schema", () => {
  test("parses account balance response values", () => {
    const result = AccountBalanceResponse().safeParse({
      balance: TestData.Valid.RawAmount1(),
      pending: TestData.Valid.RawAmount2(),
      receivable: TestData.Valid.RawAmount3(),
    });
    expect(result.success).toBe(true);
  });

  test("rejects account balance response with invalid balance", () => {
    const result = AccountBalanceResponse().safeParse({
      balance: TestData.Invalid.RawAmount.InvalidCharacters(),
      pending: TestData.Valid.RawAmount1(),
      receivable: TestData.Valid.RawAmount2(),
    });
    expect(result.success).toBe(false);
  });

  test("rejects account balance response with invalid pending amount", () => {
    const result = AccountBalanceResponse().safeParse({
      balance: TestData.Valid.RawAmount1(),
      pending: TestData.Invalid.RawAmount.InvalidCharacters(),
      receivable: TestData.Valid.RawAmount2(),
    });
    expect(result.success).toBe(false);
  });

  test("rejects account balance response with invalid receivable amount", () => {
    const result = AccountBalanceResponse().safeParse({
      balance: TestData.Valid.RawAmount1(),
      pending: TestData.Valid.RawAmount2(),
      receivable: TestData.Invalid.RawAmount.InvalidCharacters(),
    });
    expect(result.success).toBe(false);
  });
});
