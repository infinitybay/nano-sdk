import { VersionResponse } from "../../../../../src/nano/rpc/responses/version";

describe("VersionResponse schema", () => {
  test("parses version response", () => {
    const result = VersionResponse().safeParse({
      rpc_version: "1",
      store_version: "24",
      protocol_version: "21",
      node_vendor: "Nano V28.2",
      store_vendor: "LMDB 0.9.70",
      network: "live",
      network_identifier: "991CF190094C00F0B68E2E5F75F6BEE95A2E0BD93CEAA4A6734DB9F19B728948",
      build_info: '0d8eea4 "GNU C++ version " "11.4.0" "BOOST 108600" BUILT "Aug 20 2025"',
    });
    expect(result.success).toBe(true);
  });

  test("rejects version response with missing field", () => {
    const result = VersionResponse().safeParse({
      rpc_version: "1",
      store_version: "24",
      protocol_version: "21",
      node_vendor: "Nano V28.2",
      store_vendor: "LMDB 0.9.70",
      network_identifier: "991CF190094C00F0B68E2E5F75F6BEE95A2E0BD93CEAA4A6734DB9F19B728948",
      build_info: '0d8eea4 "GNU C++ version " "11.4.0" "BOOST 108600" BUILT "Aug 20 2025"',
    });
    expect(result.success).toBe(false);
  });
});
