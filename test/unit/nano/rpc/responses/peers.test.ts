import { PeersResponse } from "../../../../../src/nano/rpc/responses/peers";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("PeersResponse schema", () => {
  test("parses empty peers map", () => {
    const schema = PeersResponse({ peer_details: false });
    const result = schema.safeParse({
      peers: "",
    });
    assert(result.success);
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
          capabilities: ["topo_index", "vote_storage", "no_ledger", "unknown(0x08)"],
        },
      },
    });
    assert(result.success);
  });

  test("parses peers response with empty detail fields when peer_details is true", () => {
    const schema = PeersResponse({ peer_details: true });
    const result = schema.safeParse({
      peers: {
        "[::ffff:2.59.133.106]:7075": {
          protocol_version: "21",
          node_id: "",
          type: "tcp",
          peering: "[::ffff:2.59.133.106]:7075",
          capabilities: "",
        },
      },
    });
    assert(result.success);
  });

  test("parses peers response with string entries when peer_details is false", () => {
    const schema = PeersResponse({ peer_details: false });
    const result = schema.safeParse({
      peers: {
        "[::ffff:2.59.133.106]:7075": "21",
      },
    });
    assert(result.success);
  });

  test("rejects peers response missing capabilities when peer_details is true", () => {
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
    assert(!result.success);
  });
});
