import { WorkPeersRequest } from "../../../../../src/nano/rpc/requests/work-peers";
import { assert } from "../../../../assert";

describe("WorkPeersRequest schema", () => {
  test("validates work peers request", () => {
    const result = WorkPeersRequest().safeParse({
      action: "work_peers",
    });
    assert(result.success);
  });

  test("rejects work peers request with invalid action", () => {
    const result = WorkPeersRequest().safeParse({
      action: "work_peers_invalid",
    });
    assert(!result.success);
  });
});
