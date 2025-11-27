import { ConfirmationQuorumRequest } from "../../../../../src/nano/rpc/requests/confirmation-quorum";

describe("ConfirmationQuorumRequest schema", () => {
  test("validates confirmation quorum request with peer details flag", () => {
    const result = ConfirmationQuorumRequest().safeParse({
      action: "confirmation_quorum",
      peer_details: true,
    });
    expect(result.success).toBe(true);
  });

  test("rejects confirmation quorum request with invalid action", () => {
    const result = ConfirmationQuorumRequest().safeParse({
      action: "quorum",
    });
    expect(result.success).toBe(false);
  });
});
