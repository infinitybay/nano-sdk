import { WorkPeerAddResponse } from "../../../../../src/nano/rpc/responses/work-peer-add";

describe("WorkPeerAddResponse schema", () => {
  test("parses work peer add response", () => {
    const result = WorkPeerAddResponse().safeParse({ success: "" });
    expect(result.success).toBe(true);
  });

  test("rejects work peer add response without success", () => {
    const result = WorkPeerAddResponse().safeParse({});
    expect(result.success).toBe(false);
  });
});
