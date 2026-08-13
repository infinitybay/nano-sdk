import { BlockCreateRequest } from "../../../../../src/nano/rpc/requests/block-create";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("BlockCreateRequest schema", () => {
  test("validates state block creation with optional work parameters", () => {
    const result = BlockCreateRequest().safeParse({
      action: "block_create",
      type: "state",
      balance: TestData.Valid.RawAmount1(),
      representative: TestData.Valid.Representative1(),
      previous: TestData.Valid.PrevHash1(),
      json_block: true,
      key: TestData.Valid.PrivateKey1(),
      wallet: TestData.Valid.PublicKey1(),
      account: TestData.Valid.Account1(),
      destination: TestData.Valid.Account2(),
      source: TestData.Valid.Hash2(),
      link: TestData.Valid.Link1(),
      work: TestData.Valid.Work1(),
      version: "work_1",
      difficulty: TestData.Valid.WorkDifficulty1(),
    });
    assert(result.success);
  });

  test("rejects block creation with invalid balance", () => {
    const result = BlockCreateRequest().safeParse({
      action: "block_create",
      type: "state",
      balance: TestData.Invalid.RawAmount.InvalidCharacters(),
      representative: TestData.Valid.Representative1(),
      previous: TestData.Valid.PrevHash1(),
    });
    assert(!result.success);
  });
});
