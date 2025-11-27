import { EpochUpgradeRequest } from "../../../../../src/nano/rpc/requests/epoch-upgrade";
import { TestData } from "../../../test-data";

describe("EpochUpgradeRequest schema", () => {
  test("validates epoch upgrade request with optional count and threads", () => {
    const result = EpochUpgradeRequest().safeParse({
      action: "epoch_upgrade",
      epoch: 1,
      key: TestData.Valid.PrivateKey1(),
      count: 2,
      threads: 4,
    });
    expect(result.success).toBe(true);
  });

  test("rejects epoch upgrade request with invalid key", () => {
    const result = EpochUpgradeRequest().safeParse({
      action: "epoch_upgrade",
      epoch: 2,
      key: TestData.Invalid.PrivateKey.InvalidCharacters(),
    });
    expect(result.success).toBe(false);
  });
});
