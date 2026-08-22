import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";
import { TestData } from "../../test-data";

describe("work_validate RPC integration", () => {
  test("excludes valid without difficulty", async () => {
    const result = await Nano.RPC.work_validate(
      rpcUrl,
      {
        action: "work_validate",
        work: "0000000000000000",
        hash: TestData.KeySet().PublicKey(),
      },
      rpcRequestConfig
    );
    assert(result.success);
    expect(result.data).not.toHaveProperty("valid");
    expect(result.data.valid_all).toBe("0");
    expect(result.data.valid_receive).toBe("0");
  });

  test("returns valid when difficulty is explicitly provided", async () => {
    const result = await Nano.RPC.work_validate(
      rpcUrl,
      {
        action: "work_validate",
        work: TestData.StateBlock().work,
        hash: TestData.KeySet().PublicKey(),
        difficulty: "0000000000000000",
      },
      rpcRequestConfig
    );
    assert(result.success);
    expect(result.data.valid).toBe("1");
    expect(result.data.valid_all).toBe("1");
    expect(result.data.valid_receive).toBe("1");
  });

  test("accepts multiplier without including valid", async () => {
    const result = await Nano.RPC.work_validate(
      rpcUrl,
      {
        action: "work_validate",
        work: TestData.StateBlock().work,
        hash: TestData.KeySet().PublicKey(),
        multiplier: "1.0",
      },
      rpcRequestConfig
    );
    assert(result.success);
    expect(result.data).not.toHaveProperty("valid");
  });
});
