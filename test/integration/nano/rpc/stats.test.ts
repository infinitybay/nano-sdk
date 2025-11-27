import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";

describe("stats RPC integration", () => {
  test("returns counter stats", async () => {
    const result = await Nano.RPC.Safe.stats(
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
    const result = await Nano.RPC.Safe.stats(
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
    const result = await Nano.RPC.Safe.stats(
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
    const result = await Nano.RPC.Safe.stats(
      rpcUrl,
      {
        action: "stats",
        type: "database",
      },
      rpcRequestConfig
    );
    assert(result.success);
  });
});
