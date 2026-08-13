import { ConfirmationInfoRequest } from "../../../../../src/nano/rpc/requests/confirmation-info";
import { assert } from "../../../../assert";
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
    assert(result.success);
  });

  test("rejects confirmation info request with missing root", () => {
    const result = ConfirmationInfoRequest().safeParse({
      action: "confirmation_info",
    });
    assert(!result.success);
  });

  test("rejects confirmation info request with invalid root", () => {
    const result = ConfirmationInfoRequest().safeParse({
      action: "confirmation_info",
      root: TestData.Invalid.Root.InvalidCharacters(),
    });
    assert(!result.success);
  });
});
