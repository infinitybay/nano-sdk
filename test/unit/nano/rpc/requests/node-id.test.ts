import { NodeIdRequest } from "../../../../../src/nano/rpc/requests/node-id";

describe("NodeIdRequest schema", () => {
  test("validates node id request", () => {
    const result = NodeIdRequest().safeParse({
      action: "node_id",
    });
    expect(result.success).toBe(true);
  });

  test("rejects node id request with invalid action", () => {
    const result = NodeIdRequest().safeParse({
      action: "node_id_invalid",
    });
    expect(result.success).toBe(false);
  });
});
