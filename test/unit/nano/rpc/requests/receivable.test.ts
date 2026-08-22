import { ReceivableRequest } from "../../../../../src/nano/rpc/requests/receivable";
import { assert } from "../../../../assert";
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
    assert(result.success);
  });

  test("rejects receivable request with invalid account", () => {
    const result = ReceivableRequest().safeParse({
      action: "receivable",
      account: TestData.Invalid.Account.InvalidCharacters(),
    });
    assert(!result.success);
  });

  test("rejects receivable request with invalid threshold", () => {
    const result = ReceivableRequest().safeParse({
      action: "receivable",
      account: TestData.Valid.Account1(),
      threshold: TestData.Invalid.RawAmount.InvalidCharacters(),
    });
    assert(!result.success);
  });

  test("rejects receivable request with empty threshold", () => {
    const result = ReceivableRequest().safeParse({
      action: "receivable",
      account: TestData.Valid.Account1(),
      threshold: "",
    });
    assert(!result.success);
  });
});
