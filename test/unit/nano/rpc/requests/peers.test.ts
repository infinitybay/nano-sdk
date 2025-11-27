import { PeersRequest } from "../../../../../src/nano/rpc/requests/peers";

describe("PeersRequest schema", () => {
  test("validates peers request with optional peer details", () => {
    const result = PeersRequest().safeParse({
      action: "peers",
      peer_details: true,
    });
    expect(result.success).toBe(true);
  });

  test("rejects peers request with invalid action", () => {
    const result = PeersRequest().safeParse({
      action: "peers_invalid",
    });
    expect(result.success).toBe(false);
  });
});
