import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";

describe("stats RPC integration", () => {
  test("returns counter stats", async () => {
    const result = await Nano.RPC.stats(
      rpcUrl,
      {
        action: "stats",
        type: "counters",
      },
      rpcRequestConfig
    );
    assert(result.success);
  });

  test("returns sample stats", async () => {
    const result = await Nano.RPC.stats(
      rpcUrl,
      {
        action: "stats",
        type: "samples",
      },
      rpcRequestConfig
    );
    assert(result.success);
  });

  // Requires enable_control to be enabled
  /*test("returns object stats", async () => {
    const result = await Nano.RPC.stats(
      rpcUrl,
      {
        action: "stats",
        type: "objects",
      },
      rpcRequestConfig
    );
    assert(result.success);
  });*/

  test("returns database stats", async () => {
    const result = await Nano.RPC.stats(
      rpcUrl,
      {
        action: "stats",
        type: "database",
      },
      rpcRequestConfig
    );
    assert(result.success);

    if ("column_families" in result.data) {
      expect(result.data.levels.l0_num_files).toEqual(expect.any(String));
      for (const columnFamily of Object.values(result.data.column_families)) {
        expect(columnFamily.estimate_num_keys).toEqual(expect.any(String));
        expect(columnFamily.memtable_size).toEqual(expect.any(String));
      }
    } else {
      expect(result.data.branch_pages).toEqual(expect.any(String));
      expect(result.data.page_size).toEqual(expect.any(String));
    }
  });
});
