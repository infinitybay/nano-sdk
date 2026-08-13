import { PeersRequest } from "../../../../../src/nano/rpc/requests/peers";
import { assert } from "../../../../assert";

describe("PeersRequest schema", () => {
  test("validates peers request with optional peer details", () => {
    const result = PeersRequest().safeParse({
      action: "peers",
      peer_details: true,
    });
    assert(result.success);
  });

  test("rejects peers request with invalid action", () => {
    const result = PeersRequest().safeParse({
      action: "peers_invalid",
    });
    assert(!result.success);
  });
});
