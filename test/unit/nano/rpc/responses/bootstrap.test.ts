import { BootstrapResponse } from "../../../../../src/nano/rpc/responses/bootstrap";
import { assert } from "../../../../assert";

describe("BootstrapResponse schema", () => {
  test("parses bootstrap response", () => {
    const result = BootstrapResponse().safeParse({});
    assert(result.success);
  });
});
