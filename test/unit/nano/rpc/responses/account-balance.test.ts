import { AccountBalanceResponse } from "../../../../../src/nano/rpc/responses/account-balance";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("AccountBalanceResponse schema", () => {
  test("parses account balance response values", () => {
    const result = AccountBalanceResponse().safeParse({
      balance: TestData.Valid.RawAmount1(),
      pending: TestData.Valid.RawAmount2(),
      receivable: TestData.Valid.RawAmount3(),
    });
    assert(result.success);
  });

  test("rejects account balance response with invalid balance", () => {
    const result = AccountBalanceResponse().safeParse({
      balance: TestData.Invalid.RawAmount.InvalidCharacters(),
      pending: TestData.Valid.RawAmount1(),
      receivable: TestData.Valid.RawAmount2(),
    });
    assert(!result.success);
  });

  test("rejects account balance response with invalid pending amount", () => {
    const result = AccountBalanceResponse().safeParse({
      balance: TestData.Valid.RawAmount1(),
      pending: TestData.Invalid.RawAmount.InvalidCharacters(),
      receivable: TestData.Valid.RawAmount2(),
    });
    assert(!result.success);
  });

  test("rejects account balance response with invalid receivable amount", () => {
    const result = AccountBalanceResponse().safeParse({
      balance: TestData.Valid.RawAmount1(),
      pending: TestData.Valid.RawAmount2(),
      receivable: TestData.Invalid.RawAmount.InvalidCharacters(),
    });
    assert(!result.success);
  });
});
