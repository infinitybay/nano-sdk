import { WorkPeerAddRequest } from "../../../../../src/nano/rpc/requests/work-peer-add";
import { assert } from "../../../../assert";

describe("WorkPeerAddRequest schema", () => {
  test("validates work peer add request", () => {
    const result = WorkPeerAddRequest().safeParse({
      action: "work_peer_add",
      address: "127.0.0.1",
      port: "7075",
    });
    assert(result.success);
  });

  test("rejects work peer add request with missing port", () => {
    const result = WorkPeerAddRequest().safeParse({
      action: "work_peer_add",
      address: "127.0.0.1",
    });
    assert(!result.success);
  });
});
