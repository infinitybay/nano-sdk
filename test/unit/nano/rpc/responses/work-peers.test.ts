import { WorkPeersResponse } from "../../../../../src/nano/rpc/responses/work-peers";
import { assert } from "../../../../assert";

describe("WorkPeersResponse schema", () => {
  test("parses work peers response with empty work_peers map", () => {
    const result = WorkPeersResponse().safeParse({
      work_peers: "",
    });
    assert(result.success);
  });

  test("parses work peers response", () => {
    const result = WorkPeersResponse().safeParse({
      work_peers: ["peer1", "peer2"],
    });
    assert(result.success);
  });
});
