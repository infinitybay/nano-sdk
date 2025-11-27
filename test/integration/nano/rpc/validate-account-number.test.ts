import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";
import { TestData } from "../../test-data";

describe("validate_account_number RPC integration", () => {
  test("validates account", async () => {
    const result = await Nano.RPC.Safe.validate_account_number(
      rpcUrl,
      {
        action: "validate_account_number",
        account: TestData.GenesisAccount(),
      },
      rpcRequestConfig
    );
    assert(result.success);
    expect(result.data.valid).toBe("1");
  });

  test("validates invalid account", async () => {
    const result = await Nano.RPC.Safe.validate_account_number(
      rpcUrl,
      {
        action: "validate_account_number",
        account: `${TestData.GenesisAccount()}Z`,
      },
      rpcRequestConfig
    );
    assert(result.success);
    expect(result.data.valid).toBe("0");
  });
});
