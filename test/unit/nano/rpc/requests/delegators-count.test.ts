import { DelegatorsCountRequest } from "../../../../../src/nano/rpc/requests/delegators-count";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("DelegatorsCountRequest schema", () => {
  test("validates delegators count request", () => {
    const result = DelegatorsCountRequest().safeParse({
      action: "delegators_count",
      account: TestData.Valid.Account1(),
    });
    assert(result.success);
  });

  test("rejects delegators count request with invalid account", () => {
    const result = DelegatorsCountRequest().safeParse({
      action: "delegators_count",
      account: TestData.Invalid.Account.InvalidCharacters(),
    });
    assert(!result.success);
  });
});
