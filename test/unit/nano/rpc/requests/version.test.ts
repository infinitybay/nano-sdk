import { VersionRequest } from "../../../../../src/nano/rpc/requests/version";

describe("VersionRequest schema", () => {
  test("validates version request", () => {
    const result = VersionRequest().safeParse({
      action: "version",
    });
    expect(result.success).toBe(true);
  });

  test("rejects version request with invalid action", () => {
    const result = VersionRequest().safeParse({
      action: "version_invalid",
    });
    expect(result.success).toBe(false);
  });
});
