import { LedgerRequest } from "../../../../../src/nano/rpc/requests/ledger";
import { TestData } from "../../../test-data";

describe("LedgerRequest schema", () => {
  test("validates ledger request with optional filters", () => {
    const result = LedgerRequest().safeParse({
      action: "ledger",
      account: TestData.Valid.Account1(),
      count: 10,
      representative: true,
      weight: true,
      receivable: true,
      modified_since: 0,
      sorting: true,
      threshold: TestData.Valid.RawAmount1(),
    });
    expect(result.success).toBe(true);
  });

  test("rejects ledger request with invalid account", () => {
    const result = LedgerRequest().safeParse({
      action: "ledger",
      account: TestData.Invalid.Account.InvalidCharacters(),
      count: 1,
    });
    expect(result.success).toBe(false);
  });

  test("rejects ledger request with invalid threshold", () => {
    const result = LedgerRequest().safeParse({
      action: "ledger",
      account: TestData.Valid.Account1(),
      count: 1,
      threshold: TestData.Invalid.RawAmount.InvalidCharacters(),
    });
    expect(result.success).toBe(false);
  });
});
