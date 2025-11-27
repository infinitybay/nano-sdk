import { ConfirmationActiveRequest } from "../../../../../src/nano/rpc/requests/confirmation-active";

describe("ConfirmationActiveRequest schema", () => {
  test("validates confirmation active request with announcements", () => {
    const result = ConfirmationActiveRequest().safeParse({
      action: "confirmation_active",
      announcements: 0,
    });
    expect(result.success).toBe(true);
  });

  test("rejects confirmation active request with negative announcements", () => {
    const result = ConfirmationActiveRequest().safeParse({
      action: "confirmation_active",
      announcements: -1,
    });
    expect(result.success).toBe(false);
  });
});
