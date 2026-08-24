import { BlockInfo } from "../../../../../src/nano/rpc/responses/block-info";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("BlockInfo schema", () => {
  test("parses block info with all optional properties", () => {
    const schema = BlockInfo({
      include_linked_account: true,
      json_block: true,
      receivable: true,
      receive_hash: true,
      source: true,
    });
    const result = schema.safeParse({
      block_account: TestData.Valid.Account1(),
      amount: TestData.Valid.RawAmount1(),
      balance: TestData.Valid.RawAmount2(),
      height: TestData.Valid.Height2(),
      topo_height: TestData.Valid.Height1(),
      local_timestamp: TestData.Valid.Timestamp1(),
      successor: TestData.Valid.Hash2(),
      confirmed: "true",
      subtype: "send",
      linked_account: TestData.Valid.Account2(),
      contents: TestData.Valid.StateBlock1(),
      receivable: "1",
      receive_hash: TestData.Valid.Hash3(),
      source_account: TestData.Valid.Account3(),
    });
    assert(result.success);
    expect(result.data.topo_height).toBe(TestData.Valid.Height1());
  });

  test("parses block info with all options disabled", () => {
    const schema = BlockInfo({
      include_linked_account: false,
      json_block: false,
      receivable: false,
      receive_hash: false,
      source: false,
    });
    const result = schema.parse({
      block_account: TestData.Valid.Account1(),
      balance: TestData.Valid.RawAmount1(),
      height: TestData.Valid.Height1(),
      topo_height: TestData.Valid.Height2(),
      local_timestamp: TestData.Valid.Timestamp1(),
      successor: TestData.Valid.Hash1(),
      confirmed: "false",
      contents: "block-data",
    });
    expect(result.contents).toBe("block-data");
  });

  test("rejects the unknown subtype", () => {
    const schema = BlockInfo({
      include_linked_account: false,
      json_block: false,
      receivable: false,
      receive_hash: false,
      source: false,
    });
    const result = schema.safeParse({
      block_account: TestData.Valid.Account1(),
      balance: TestData.Valid.RawAmount1(),
      height: TestData.Valid.Height1(),
      local_timestamp: TestData.Valid.Timestamp1(),
      successor: TestData.Valid.Hash1(),
      confirmed: "false",
      subtype: "unknown",
      contents: "block-data",
    });
    assert(!result.success);
  });

  test("rejects block info with invalid linked account", () => {
    const schema = BlockInfo({
      include_linked_account: true,
      json_block: true,
      receivable: false,
      receive_hash: false,
      source: false,
    });
    const result = schema.safeParse({
      block_account: TestData.Valid.Account1(),
      balance: TestData.Valid.RawAmount1(),
      height: TestData.Valid.Height1(),
      topo_height: TestData.Valid.Height2(),
      local_timestamp: TestData.Valid.Timestamp1(),
      successor: TestData.Valid.Hash2(),
      confirmed: "false",
      linked_account: TestData.Invalid.Account.InvalidCharacters(),
      contents: TestData.Valid.StateBlock1(),
    });
    assert(!result.success);
  });

  test("rejects block info without topology height", () => {
    const schema = BlockInfo({
      include_linked_account: false,
      json_block: false,
      receivable: false,
      receive_hash: false,
      source: false,
    });
    const result = schema.safeParse({
      block_account: TestData.Valid.Account1(),
      balance: TestData.Valid.RawAmount1(),
      height: TestData.Valid.Height1(),
      local_timestamp: TestData.Valid.Timestamp1(),
      successor: TestData.Valid.Hash1(),
      confirmed: "false",
      contents: "block-data",
    });
    assert(!result.success);
  });

  test("rejects block info with invalid topology height", () => {
    const schema = BlockInfo({
      include_linked_account: false,
      json_block: false,
      receivable: false,
      receive_hash: false,
      source: false,
    });
    const result = schema.safeParse({
      block_account: TestData.Valid.Account1(),
      balance: TestData.Valid.RawAmount1(),
      height: TestData.Valid.Height1(),
      topo_height: TestData.Invalid.Height.Negative(),
      local_timestamp: TestData.Valid.Timestamp1(),
      successor: TestData.Valid.Hash1(),
      confirmed: "false",
      contents: "block-data",
    });
    assert(!result.success);
  });
});
