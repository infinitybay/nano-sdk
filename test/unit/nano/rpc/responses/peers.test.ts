import { PeersResponse } from "../../../../../src/nano/rpc/responses/peers";
import { TestData } from "../../../test-data";

describe("PeersResponse schema", () => {
  test("parses empty peers map", () => {
    const schema = PeersResponse({ peer_details: false });
    const result = schema.safeParse({
      peers: "",
    });
    expect(result.success).toBe(true);
  });

  test("parses peers response with detailed entries when peer_details is true", () => {
    const schema = PeersResponse({ peer_details: true });
    const result = schema.safeParse({
      peers: {
        "[::ffff:2.59.133.106]:7075": {
          protocol_version: "21",
          node_id: TestData.Valid.NodeId1(),
          type: "tcp",
          peering: "[::ffff:2.59.133.106]:7075",
        },
      },
    });
    expect(result.success).toBe(true);
  });

  test("parses peers response with detailed entries when peer_details is true and node_id is empty", () => {
    const schema = PeersResponse({ peer_details: true });
    const result = schema.safeParse({
      peers: {
        "[::ffff:2.59.133.106]:7075": {
          protocol_version: "21",
          node_id: "",
          type: "tcp",
          peering: "[::ffff:2.59.133.106]:7075",
        },
      },
    });
    expect(result.success).toBe(true);
  });

  test("parses peers response with string entries when peer_details is false", () => {
    const schema = PeersResponse({ peer_details: false });
    const result = schema.safeParse({
      peers: {
        "[::ffff:2.59.133.106]:7075": "21",
      },
    });
    expect(result.success).toBe(true);
  });

  test("rejects peers response missing detail fields when peer_details is true", () => {
    const schema = PeersResponse({ peer_details: true });
    const result = schema.safeParse({
      peers: {
        "[::ffff:2.59.133.106]:7075": {
          node_id: TestData.Valid.NodeId1(),
          type: "tcp",
        },
      },
    });
    expect(result.success).toBe(false);
  });
});
