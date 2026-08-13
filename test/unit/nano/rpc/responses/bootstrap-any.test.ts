import { BootstrapAnyResponse } from "../../../../../src/nano/rpc/responses/bootstrap-any";
import { assert } from "../../../../assert";

describe("BootstrapAnyResponse schema", () => {
  test("parses bootstrap any response", () => {
    const result = BootstrapAnyResponse().safeParse({});
    assert(result.success);
  });
});
