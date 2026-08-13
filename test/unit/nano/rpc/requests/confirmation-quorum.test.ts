import { ConfirmationQuorumRequest } from "../../../../../src/nano/rpc/requests/confirmation-quorum";
import { assert } from "../../../../assert";

describe("ConfirmationQuorumRequest schema", () => {
  test("validates confirmation quorum request with peer details flag", () => {
    const result = ConfirmationQuorumRequest().safeParse({
      action: "confirmation_quorum",
      peer_details: true,
    });
    assert(result.success);
  });

  test("rejects confirmation quorum request with invalid action", () => {
    const result = ConfirmationQuorumRequest().safeParse({
      action: "quorum",
    });
    assert(!result.success);
  });
});
