import { ConfirmationInfoRequest } from "../../../../../src/nano/rpc/requests/confirmation-info";
import { TestData } from "../../../test-data";

describe("ConfirmationInfoRequest schema", () => {
  test("validates confirmation info request with optional flags", () => {
    const result = ConfirmationInfoRequest().safeParse({
      action: "confirmation_info",
      root: TestData.Valid.Root1(),
      contents: true,
      json_block: true,
      representatives: true,
    });
    expect(result.success).toBe(true);
  });

  test("rejects confirmation info request with missing root", () => {
    const result = ConfirmationInfoRequest().safeParse({
      action: "confirmation_info",
    });
    expect(result.success).toBe(false);
  });

  test("rejects confirmation info request with invalid root", () => {
    const result = ConfirmationInfoRequest().safeParse({
      action: "confirmation_info",
      root: TestData.Invalid.Root.InvalidCharacters(),
    });
    expect(result.success).toBe(false);
  });
});
