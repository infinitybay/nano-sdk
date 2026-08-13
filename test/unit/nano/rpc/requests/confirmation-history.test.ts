import { ConfirmationHistoryRequest } from "../../../../../src/nano/rpc/requests/confirmation-history";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("ConfirmationHistoryRequest schema", () => {
  test("validates confirmation history request with optional hash", () => {
    const result = ConfirmationHistoryRequest().safeParse({
      action: "confirmation_history",
      hash: TestData.Valid.Hash1(),
    });
    assert(result.success);
  });

  test("rejects confirmation history request with invalid hash", () => {
    const result = ConfirmationHistoryRequest().safeParse({
      action: "confirmation_history",
      hash: TestData.Invalid.Hash.InvalidCharacters(),
    });
    assert(!result.success);
  });
});
