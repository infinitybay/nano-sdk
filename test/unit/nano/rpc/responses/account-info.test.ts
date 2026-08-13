import { AccountInfoResponse } from "../../../../../src/nano/rpc/responses/account-info";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("AccountInfoResponse schema", () => {
  test("parses account info response with all optional fields", () => {
    const schema = AccountInfoResponse({
      representative: true,
      weight: true,
      receivable: true,
      include_confirmed: true,
    });
    const result = schema.safeParse({
      frontier: TestData.Valid.Hash1(),
      open_block: TestData.Valid.Hash2(),
      representative_block: TestData.Valid.Hash3(),
      balance: TestData.Valid.RawAmount1(),
      modified_timestamp: TestData.Valid.Timestamp1(),
      block_count: "5",
      account_version: "1",
      representative: TestData.Valid.Representative1(),
      weight: TestData.Valid.RawAmount2(),
      receivable: TestData.Valid.RawAmount3(),
      confirmed_balance: TestData.Valid.RawAmount4(),
      confirmed_height: TestData.Valid.Height1(),
      confirmed_frontier: TestData.Valid.Hash4(),
      confirmed_representative: TestData.Valid.Representative2(),
      confirmed_receivable: TestData.Valid.RawAmount1(),
    });
    assert(result.success);
    expect(result.data.representative).toBe(TestData.Valid.Representative1());
    expect(result.data.weight).toBe(TestData.Valid.RawAmount2());
    expect(result.data.receivable).toBe(TestData.Valid.RawAmount3());
    expect(result.data.confirmed_balance).toBe(TestData.Valid.RawAmount4());
  });

  test("parses account info response with all optional fields disabled", () => {
    const schema = AccountInfoResponse({
      representative: false,
      weight: false,
      receivable: false,
      include_confirmed: false,
    });
    const result = schema.safeParse({
      frontier: TestData.Valid.Hash1(),
      open_block: TestData.Valid.Hash2(),
      representative_block: TestData.Valid.Hash3(),
      balance: TestData.Valid.RawAmount1(),
      modified_timestamp: TestData.Valid.Timestamp1(),
      block_count: "5",
      account_version: "1",
    });
    assert(result.success);
  });

  test("rejects account info response with invalid frontier", () => {
    const schema = AccountInfoResponse({
      representative: false,
      weight: false,
      receivable: false,
      include_confirmed: false,
    });
    const result = schema.safeParse({
      frontier: TestData.Invalid.Hash.InvalidCharacters(),
      open_block: TestData.Valid.Hash2(),
      representative_block: TestData.Valid.Hash3(),
      balance: TestData.Valid.RawAmount1(),
      modified_timestamp: TestData.Valid.Timestamp1(),
      block_count: "5",
      account_version: "1",
    });
    assert(!result.success);
  });

  test("rejects account info response with invalid balance", () => {
    const schema = AccountInfoResponse({
      representative: false,
      weight: false,
      receivable: false,
      include_confirmed: false,
    });
    const result = schema.safeParse({
      frontier: TestData.Valid.Hash1(),
      open_block: TestData.Valid.Hash2(),
      representative_block: TestData.Valid.Hash3(),
      balance: TestData.Invalid.RawAmount.InvalidCharacters(),
      modified_timestamp: TestData.Valid.Timestamp1(),
      block_count: "5",
      account_version: "1",
    });
    assert(!result.success);
  });
});
