import { ConfirmationActiveRequest } from "../../../../../src/nano/rpc/requests/confirmation-active";
import { assert } from "../../../../assert";

describe("ConfirmationActiveRequest schema", () => {
  test("validates confirmation active request with announcements", () => {
    const result = ConfirmationActiveRequest().safeParse({
      action: "confirmation_active",
      announcements: 0,
    });
    assert(result.success);
  });

  test("rejects confirmation active request with negative announcements", () => {
    const result = ConfirmationActiveRequest().safeParse({
      action: "confirmation_active",
      announcements: -1,
    });
    assert(!result.success);
  });
});
