import { NodeIdRequest } from "../../../../../src/nano/rpc/requests/node-id";
import { assert } from "../../../../assert";

describe("NodeIdRequest schema", () => {
  test("validates node id request", () => {
    const result = NodeIdRequest().safeParse({
      action: "node_id",
    });
    assert(result.success);
  });

  test("rejects node id request with invalid action", () => {
    const result = NodeIdRequest().safeParse({
      action: "node_id_invalid",
    });
    assert(!result.success);
  });
});
