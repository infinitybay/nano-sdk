import { ConfirmationActiveResponse } from "../../../../../src/nano/rpc/responses/confirmation-active";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("ConfirmationActiveResponse schema", () => {
  test("parses empty confirmation active response confirmations", () => {
    const result = ConfirmationActiveResponse().safeParse({
      confirmations: "",
      unconfirmed: "3",
      confirmed: "2",
    });
    assert(result.success);
  });

  test("parses confirmation active response", () => {
    const result = ConfirmationActiveResponse().safeParse({
      confirmations: [TestData.Valid.Root1(), TestData.Valid.Root2()],
      unconfirmed: "3",
      confirmed: "2",
    });
    assert(result.success);
  });

  test("rejects confirmation active response with invalid confirmations type", () => {
    const result = ConfirmationActiveResponse().safeParse({
      confirmations: 1,
      unconfirmed: "0",
      confirmed: "0",
    });
    assert(!result.success);
  });
});
