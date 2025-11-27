import { WorkPeersClearRequest } from "../../../../../src/nano/rpc/requests/work-peers-clear";

describe("WorkPeersClearRequest schema", () => {
  test("validates work peers clear request", () => {
    const result = WorkPeersClearRequest().safeParse({
      action: "work_peers_clear",
    });
    expect(result.success).toBe(true);
  });

  test("rejects work peers clear request with invalid action", () => {
    const result = WorkPeersClearRequest().safeParse({
      action: "work_peers_clear_invalid",
    });
    expect(result.success).toBe(false);
  });
});
