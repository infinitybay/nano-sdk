import { NodeIdResponse } from "../../../../../src/nano/rpc/responses/node-id";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("NodeIdResponse schema", () => {
  test("parses node id response", () => {
    const result = NodeIdResponse().safeParse({
      public: TestData.Valid.PublicKey1(),
      as_account: TestData.Valid.Account1(),
      node_id: TestData.Valid.NodeId1(),
    });
    assert(result.success);
  });

  test("rejects node id response with invalid account", () => {
    const result = NodeIdResponse().safeParse({
      public: TestData.Valid.PublicKey1(),
      as_account: TestData.Invalid.Account.InvalidCharacters(),
      node_id: TestData.Valid.NodeId1(),
    });
    assert(!result.success);
  });
});
