import { WorkPeersClearRequest } from "../../../../../src/nano/rpc/requests/work-peers-clear";
import { assert } from "../../../../assert";

describe("WorkPeersClearRequest schema", () => {
  test("validates work peers clear request", () => {
    const result = WorkPeersClearRequest().safeParse({
      action: "work_peers_clear",
    });
    assert(result.success);
  });

  test("rejects work peers clear request with invalid action", () => {
    const result = WorkPeersClearRequest().safeParse({
      action: "work_peers_clear_invalid",
    });
    assert(!result.success);
  });
});
