import { WorkPeerAddRequest } from "../../../../../src/nano/rpc/requests/work-peer-add";

describe("WorkPeerAddRequest schema", () => {
  test("validates work peer add request", () => {
    const result = WorkPeerAddRequest().safeParse({
      action: "work_peer_add",
      address: "127.0.0.1",
      port: "7075",
    });
    expect(result.success).toBe(true);
  });

  test("rejects work peer add request with missing port", () => {
    const result = WorkPeerAddRequest().safeParse({
      action: "work_peer_add",
      address: "127.0.0.1",
    });
    expect(result.success).toBe(false);
  });
});
