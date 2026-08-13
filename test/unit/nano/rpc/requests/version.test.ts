import { VersionRequest } from "../../../../../src/nano/rpc/requests/version";
import { assert } from "../../../../assert";

describe("VersionRequest schema", () => {
  test("validates version request", () => {
    const result = VersionRequest().safeParse({
      action: "version",
    });
    assert(result.success);
  });

  test("rejects version request with invalid action", () => {
    const result = VersionRequest().safeParse({
      action: "version_invalid",
    });
    assert(!result.success);
  });
});
