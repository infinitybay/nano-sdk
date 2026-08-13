import { BootstrapAnyRequest } from "../../../../../src/nano/rpc/requests/bootstrap-any";
import { assert } from "../../../../assert";

describe("BootstrapAnyRequest schema", () => {
  test("validates bootstrap any request with optional force", () => {
    const result = BootstrapAnyRequest().safeParse({
      action: "bootstrap_any",
      force: true,
    });
    assert(result.success);
  });
});
