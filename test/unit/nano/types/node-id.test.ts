import { NodeIdString } from "../../../../src/nano/types";
import { assert } from "../../../assert";
import { TestData } from "../../test-data";

describe("NodeIdString schema", () => {
  test("validates parsing of valid node ids", () => {
    const validNodeIds = [
      TestData.Valid.NodeId1(),
      TestData.Valid.NodeId2(),
      TestData.Valid.NodeId3(),
      TestData.Valid.NodeId4(),
    ];
    for (const validNodeId of validNodeIds) {
      expect(NodeIdString().parse(validNodeId)).toBe(validNodeId);
    }
  });

  test("rejects node ids with checksum mismatch", () => {
    const result = NodeIdString().safeParse(TestData.Invalid.NodeId.ChecksumMismatch());
    assert(!result.success);
  });

  test("rejects node ids with invalid characters", () => {
    const result = NodeIdString().safeParse(TestData.Invalid.NodeId.InvalidCharacters());
    assert(!result.success);
  });

  test("rejects node ids missing nano prefix", () => {
    const result = NodeIdString().safeParse(TestData.Invalid.NodeId.PrefixMissing());
    assert(!result.success);
  });

  test("rejects node ids with incorrect prefix", () => {
    const result = NodeIdString().safeParse(TestData.Invalid.NodeId.PrefixWrong());
    assert(!result.success);
  });

  test("rejects node ids exceeding length limit", () => {
    const result = NodeIdString().safeParse(TestData.Invalid.NodeId.TooLong());
    assert(!result.success);
  });

  test("rejects node ids below length requirement", () => {
    const result = NodeIdString().safeParse(TestData.Invalid.NodeId.TooShort());
    assert(!result.success);
  });
});
