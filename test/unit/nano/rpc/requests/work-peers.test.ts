import { WorkPeersRequest } from "../../../../../src/nano/rpc/requests/work-peers";

describe("WorkPeersRequest schema", () => {
  test("validates work peers request", () => {
    const result = WorkPeersRequest().safeParse({
      action: "work_peers",
    });
    expect(result.success).toBe(true);
  });

  test("rejects work peers request with invalid action", () => {
    const result = WorkPeersRequest().safeParse({
      action: "work_peers_invalid",
    });
    expect(result.success).toBe(false);
  });
});
