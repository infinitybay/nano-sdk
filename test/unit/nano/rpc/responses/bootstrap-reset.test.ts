import { BootstrapResetResponse } from "../../../../../src/nano/rpc/responses/bootstrap-reset";
import { assert } from "../../../../assert";

describe("BootstrapResetResponse schema", () => {
  test("parses bootstrap reset response", () => {
    const result = BootstrapResetResponse().safeParse({
      success: "",
    });
    assert(result.success);
  });

  test("rejects bootstrap reset response with missing success", () => {
    const result = BootstrapResetResponse().safeParse({});
    assert(!result.success);
  });
});
