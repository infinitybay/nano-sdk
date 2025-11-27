import { WorkPeersResponse } from "../../../../../src/nano/rpc/responses/work-peers";

describe("WorkPeersResponse schema", () => {
  test("parses work peers response with empty work_peers map", () => {
    const result = WorkPeersResponse().safeParse({
      work_peers: "",
    });
    expect(result.success).toBe(true);
  });

  test("parses work peers response", () => {
    const result = WorkPeersResponse().safeParse({
      work_peers: ["peer1", "peer2"],
    });
    expect(result.success).toBe(true);
  });
});
