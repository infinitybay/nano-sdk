import { ReceivableExistsRequest } from "../../../../../src/nano/rpc/requests/receivable-exists";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("ReceivableExistsRequest schema", () => {
  test("validates receivable exists request with optional flags", () => {
    const result = ReceivableExistsRequest().safeParse({
      action: "receivable_exists",
      hash: TestData.Valid.Hash1(),
      include_active: true,
      include_only_confirmed: true,
    });
    assert(result.success);
  });

  test("rejects receivable exists request with invalid hash", () => {
    const result = ReceivableExistsRequest().safeParse({
      action: "receivable_exists",
      hash: TestData.Invalid.Hash.InvalidCharacters(),
    });
    assert(!result.success);
  });
});
