import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";
import { TestData } from "../../test-data";

describe("receivable_exists RPC integration", () => {
  test("checks if receivable exists", async () => {
    const result = await Nano.RPC.Safe.receivable_exists(
      rpcUrl,
      {
        action: "receivable_exists",
        hash: TestData.BurnBlockHash(),
        include_active: true,
      },
      rpcRequestConfig
    );
    assert(result.success);
    expect(result.data.exists).toBe("1");
  });
});
