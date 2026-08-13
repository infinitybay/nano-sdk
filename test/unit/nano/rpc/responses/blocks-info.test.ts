import { BlocksInfoResponse } from "../../../../../src/nano/rpc/responses/blocks-info";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("BlocksInfoResponse schema", () => {
  test("parses empty blocks info response", () => {
    const result = BlocksInfoResponse({
      include_linked_account: false,
      include_not_found: false,
      json_block: false,
      receivable: false,
      receive_hash: false,
      source: false,
    }).safeParse({
      blocks: "",
    });
    assert(result.success);
  });

  test("parses blocks info response with all optional properties", () => {
    const schema = BlocksInfoResponse({
      include_linked_account: true,
      include_not_found: true,
      json_block: true,
      receivable: true,
      receive_hash: true,
      source: true,
    });
    const result = schema.safeParse({
      blocks: {
        [TestData.Valid.Hash1()]: {
          block_account: TestData.Valid.Account1(),
          amount: TestData.Valid.RawAmount1(),
          balance: TestData.Valid.RawAmount2(),
          height: TestData.Valid.Height1(),
          local_timestamp: TestData.Valid.Timestamp1(),
          successor: TestData.Valid.Hash2(),
          confirmed: "true",
          subtype: "receive",
          linked_account: TestData.Valid.Account2(),
          contents: TestData.Valid.StateBlock1(),
          receivable: "1",
          receive_hash: TestData.Valid.Hash3(),
          source_account: TestData.Valid.Account3(),
        },
      },
      blocks_not_found: [TestData.Valid.Hash4()],
    });
    assert(result.success);
  });

  test("parses blocks info response with all options disabled", () => {
    const schema = BlocksInfoResponse({
      include_linked_account: false,
      include_not_found: false,
      json_block: false,
      receivable: false,
      receive_hash: false,
      source: false,
    });
    const result = schema.safeParse({
      blocks: {
        [TestData.Valid.Hash1()]: {
          block_account: TestData.Valid.Account1(),
          balance: TestData.Valid.RawAmount1(),
          height: TestData.Valid.Height1(),
          local_timestamp: TestData.Valid.Timestamp1(),
          successor: TestData.Valid.Hash2(),
          confirmed: "false",
          contents: "block-data",
        },
      },
    });
    assert(result.success);
  });

  test("rejects blocks info response with invalid block account entry", () => {
    const schema = BlocksInfoResponse({
      include_linked_account: false,
      include_not_found: false,
      json_block: true,
      receivable: false,
      receive_hash: false,
      source: false,
    });
    const result = schema.safeParse({
      blocks: {
        [TestData.Valid.Hash1()]: {
          block_account: TestData.Invalid.Account.InvalidCharacters(),
          balance: TestData.Valid.RawAmount1(),
          height: TestData.Valid.Height1(),
          local_timestamp: TestData.Valid.Timestamp1(),
          successor: TestData.Valid.Hash2(),
          confirmed: "true",
          contents: TestData.Valid.StateBlock1(),
        },
      },
    });
    assert(!result.success);
  });
});
