import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";

describe("election_statistics RPC integration", () => {
  test("returns election statistics", async () => {
    const result = await Nano.RPC.Safe.election_statistics(
      rpcUrl,
      {
        action: "election_statistics",
      },
      rpcRequestConfig
    );
    assert(result.success);
  });
});
