import { BootstrapLazyResponse } from "../../../../../src/nano/rpc/responses/bootstrap-lazy";
import { assert } from "../../../../assert";

describe("BootstrapLazyResponse schema", () => {
  test("parses bootstrap lazy response", () => {
    const result = BootstrapLazyResponse().safeParse({});
    assert(result.success);
  });
});
