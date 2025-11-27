import { ConfirmationRequest } from "../../../../../src/nano/web-socket/requests/confirmation";
import { TestData } from "../../../test-data";

describe("ConfirmationRequest schema", () => {
  test("validates confirmation request with account filters and options", () => {
    const result = ConfirmationRequest().safeParse({
      action: "subscribe",
      topic: "confirmation",
      ack: true,
      options: {
        accounts: [TestData.Valid.Account1(), TestData.Valid.Account2()],
        accounts_add: [TestData.Valid.Account3()],
        accounts_del: [TestData.Valid.Account4()],
        all_local_accounts: true,
        confirmation_type: "active",
        include_block: true,
        include_election_info: true,
        include_election_info_with_votes: true,
        include_linked_account: true,
        include_sideband_info: true,
      },
    });
    expect(result.success).toBe(true);
  });

  test("rejects confirmation request with invalid account list", () => {
    const result = ConfirmationRequest().safeParse({
      action: "subscribe",
      topic: "confirmation",
      options: {
        accounts: [TestData.Invalid.Account.InvalidCharacters()],
      },
    });
    expect(result.success).toBe(false);
  });
});
