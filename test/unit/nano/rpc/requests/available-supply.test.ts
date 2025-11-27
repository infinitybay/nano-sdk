import { AvailableSupplyRequest } from "../../../../../src/nano/rpc/requests/available-supply";

describe("AvailableSupplyRequest schema", () => {
  test("validates available supply request", () => {
    const result = AvailableSupplyRequest().safeParse({
      action: "available_supply",
    });
    expect(result.success).toBe(true);
  });

  test("rejects available supply request with invalid action", () => {
    const result = AvailableSupplyRequest().safeParse({
      action: "other",
    });
    expect(result.success).toBe(false);
  });
});
