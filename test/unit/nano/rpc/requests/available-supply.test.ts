import { AvailableSupplyRequest } from "../../../../../src/nano/rpc/requests/available-supply";
import { assert } from "../../../../assert";

describe("AvailableSupplyRequest schema", () => {
  test("validates available supply request", () => {
    const result = AvailableSupplyRequest().safeParse({
      action: "available_supply",
    });
    assert(result.success);
  });

  test("rejects available supply request with invalid action", () => {
    const result = AvailableSupplyRequest().safeParse({
      action: "other",
    });
    assert(!result.success);
  });
});
