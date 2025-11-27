import { ReceivableRequest } from "../../../../../src/nano/rpc/requests/receivable";
import { TestData } from "../../../test-data";

describe("ReceivableRequest schema", () => {
  test("validates receivable request with threshold and flags", () => {
    const result = ReceivableRequest().safeParse({
      action: "receivable",
      account: TestData.Valid.Account1(),
      count: 5,
      offset: 1,
      threshold: TestData.Valid.RawAmount1(),
      source: true,
      include_active: true,
      include_only_confirmed: true,
      min_version: true,
      sorting: true,
    });
    expect(result.success).toBe(true);
  });

  test("rejects receivable request with invalid account", () => {
    const result = ReceivableRequest().safeParse({
      action: "receivable",
      account: TestData.Invalid.Account.InvalidCharacters(),
    });
    expect(result.success).toBe(false);
  });

  test("rejects receivable request with invalid threshold", () => {
    const result = ReceivableRequest().safeParse({
      action: "receivable",
      account: TestData.Valid.Account1(),
      threshold: TestData.Invalid.RawAmount.InvalidCharacters(),
    });
    expect(result.success).toBe(false);
  });
});
