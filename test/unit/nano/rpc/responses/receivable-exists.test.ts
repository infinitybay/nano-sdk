import { ReceivableExistsResponse } from "../../../../../src/nano/rpc/responses/receivable-exists";
import { assert } from "../../../../assert";

describe("ReceivableExistsResponse schema", () => {
  test("parses receivable exists positive response", () => {
    const result = ReceivableExistsResponse().safeParse({ exists: "1" });
    assert(result.success);
  });

  test("rejects receivable exists response with invalid flag", () => {
    const result = ReceivableExistsResponse().safeParse({ exists: "2" });
    assert(!result.success);
  });
});
