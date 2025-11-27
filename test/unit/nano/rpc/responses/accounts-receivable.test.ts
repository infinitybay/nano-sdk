import { AccountsReceivableResponse } from "../../../../../src/nano/rpc/responses/accounts-receivable";
import { TestData } from "../../../test-data";

describe("AccountsReceivableResponse schema", () => {
  test("parses empty receivable blocks payload", () => {
    const result = AccountsReceivableResponse({ source: false, threshold: false }).safeParse({
      blocks: "",
    });
    expect(result.success).toBe(true);
  });

  test("parses receivable blocks without source and threshold flags", () => {
    const result = AccountsReceivableResponse({ source: false, threshold: false }).safeParse({
      blocks: {
        [TestData.Valid.Account1()]: [TestData.Valid.Hash1(), TestData.Valid.Hash2()],
      },
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.blocks).toBeTruthy();
      if (result.data.blocks !== "") {
        expect(result.data.blocks[TestData.Valid.Account1()][0]).toBe(TestData.Valid.Hash1());
        expect(result.data.blocks[TestData.Valid.Account1()][1]).toBe(TestData.Valid.Hash2());
      }
    }
  });

  test("parses receivable blocks with source flag", () => {
    const result = AccountsReceivableResponse({ source: true, threshold: false }).safeParse({
      blocks: {
        [TestData.Valid.Account1()]: {
          [TestData.Valid.Hash1()]: {
            amount: TestData.Valid.RawAmount1(),
            source: TestData.Valid.Account2(),
          },
        },
      },
    });
    expect(result.success).toBe(true);
  });

  test("parses receivable blocks with threshold flag", () => {
    const result = AccountsReceivableResponse({ source: false, threshold: true }).safeParse({
      blocks: {
        [TestData.Valid.Account1()]: {
          [TestData.Valid.Hash1()]: TestData.Valid.RawAmount1(),
        },
      },
    });
    expect(result.success).toBe(true);
  });

  test("rejects receivable blocks with invalid hash key", () => {
    const result = AccountsReceivableResponse({ source: false, threshold: false }).safeParse({
      blocks: {
        [TestData.Valid.Account1()]: [TestData.Invalid.Hash.InvalidCharacters()],
      },
    });
    expect(result.success).toBe(false);
  });
});
