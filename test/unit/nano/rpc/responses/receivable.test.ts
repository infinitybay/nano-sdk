import { ReceivableResponse } from "../../../../../src/nano/rpc/responses/receivable";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("ReceivableResponse schema", () => {
  test("parses receivable response with empty blocks map", () => {
    const schema = ReceivableResponse({ min_version: false, source: false, threshold: false });
    const result = schema.safeParse({
      blocks: "",
    });
    assert(result.success);
  });

  test("parses receivable response with min_version, source and threshold", () => {
    const schema = ReceivableResponse({ min_version: true, source: true, threshold: true });
    const result = schema.safeParse({
      blocks: {
        [TestData.Valid.Hash1()]: {
          amount: TestData.Valid.RawAmount1(),
          source: TestData.Valid.Account1(),
          min_version: "1",
        },
      },
    });
    assert(result.success);
    assert(result.data.blocks);
    expect(result.data.blocks[TestData.Valid.Hash1()].min_version).toBe("1");
  });

  test("parses receivable response with min_version", () => {
    const schema = ReceivableResponse({ min_version: true, source: false, threshold: false });
    const result = schema.safeParse({
      blocks: {
        [TestData.Valid.Hash1()]: {
          amount: TestData.Valid.RawAmount1(),
          min_version: "1",
        },
      },
    });
    assert(result.success);
    assert(result.data.blocks);
    expect(result.data.blocks[TestData.Valid.Hash1()].min_version).toBe("1");
  });

  test("parses receivable response with source", () => {
    const schema = ReceivableResponse({ min_version: false, source: true, threshold: false });
    const result = schema.safeParse({
      blocks: {
        [TestData.Valid.Hash1()]: {
          amount: TestData.Valid.RawAmount1(),
          source: TestData.Valid.Account1(),
        },
      },
    });
    assert(result.success);
  });

  test("parses receivable response with threshold", () => {
    const schema = ReceivableResponse({ min_version: false, source: false, threshold: true });
    const result = schema.safeParse({
      blocks: {
        [TestData.Valid.Hash1()]: TestData.Valid.RawAmount1(),
      },
    });
    assert(result.success);
  });

  test("parses receivable response when no flags are set", () => {
    const schema = ReceivableResponse({ min_version: false, source: false, threshold: false });
    const result = schema.safeParse({
      blocks: [TestData.Valid.Hash1(), TestData.Valid.Hash2()],
    });
    assert(result.success);
  });
});
