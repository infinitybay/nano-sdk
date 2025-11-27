import { LedgerResponse } from "../../../../../src/nano/rpc/responses/ledger";
import { TestData } from "../../../test-data";

describe("LedgerResponse schema", () => {
  test("parses ledger response with empty accounts map", () => {
    const schema = LedgerResponse({ receivable: false, representative: false, weight: false });
    const result = schema.safeParse({
      accounts: "",
    });
    expect(result.success).toBe(true);
  });

  test("parses ledger response with receivable, representative, and weight", () => {
    const schema = LedgerResponse({ receivable: true, representative: true, weight: true });
    const result = schema.safeParse({
      accounts: {
        [TestData.Valid.Account1()]: {
          frontier: TestData.Valid.Hash1(),
          open_block: TestData.Valid.Hash2(),
          representative_block: TestData.Valid.Hash3(),
          balance: TestData.Valid.RawAmount1(),
          modified_timestamp: TestData.Valid.Timestamp1(),
          block_count: TestData.Valid.Height1(),
          pending: TestData.Valid.RawAmount2(),
          receivable: TestData.Valid.RawAmount2(),
          representative: TestData.Valid.Representative1(),
          weight: TestData.Valid.RawAmount3(),
        },
      },
    });
    expect(result.success).toBe(true);
  });

  test("parses ledger response without optional properties when flags are false", () => {
    const schema = LedgerResponse({ receivable: false, representative: false, weight: false });
    const result = schema.safeParse({
      accounts: {
        [TestData.Valid.Account1()]: {
          frontier: TestData.Valid.Hash1(),
          open_block: TestData.Valid.Hash2(),
          representative_block: TestData.Valid.Hash3(),
          balance: TestData.Valid.RawAmount1(),
          modified_timestamp: TestData.Valid.Timestamp1(),
          block_count: TestData.Valid.Height1(),
        },
      },
    });
    expect(result.success).toBe(true);
  });

  test("rejects ledger response when receivable fields are missing despite flag", () => {
    const schema = LedgerResponse({ receivable: true, representative: false, weight: false });
    const result = schema.safeParse({
      accounts: {
        [TestData.Valid.Account1()]: {
          frontier: TestData.Valid.Hash1(),
          open_block: TestData.Valid.Hash2(),
          representative_block: TestData.Valid.Hash3(),
          balance: TestData.Valid.RawAmount1(),
          modified_timestamp: TestData.Valid.Timestamp1(),
          block_count: TestData.Valid.Height1(),
        },
      },
    });
    expect(result.success).toBe(false);
  });

  test("rejects ledger response when representative field is missing despite flag", () => {
    const schema = LedgerResponse({ receivable: false, representative: true, weight: false });
    const result = schema.safeParse({
      accounts: {
        [TestData.Valid.Account1()]: {
          frontier: TestData.Valid.Hash1(),
          open_block: TestData.Valid.Hash2(),
          representative_block: TestData.Valid.Hash3(),
          balance: TestData.Valid.RawAmount1(),
          modified_timestamp: TestData.Valid.Timestamp1(),
          block_count: TestData.Valid.Height1(),
        },
      },
    });
    expect(result.success).toBe(false);
  });

  test("rejects ledger response when weight field is missing despite flag", () => {
    const schema = LedgerResponse({ receivable: false, representative: false, weight: true });
    const result = schema.safeParse({
      accounts: {
        [TestData.Valid.Account1()]: {
          frontier: TestData.Valid.Hash1(),
          open_block: TestData.Valid.Hash2(),
          representative_block: TestData.Valid.Hash3(),
          balance: TestData.Valid.RawAmount1(),
          modified_timestamp: TestData.Valid.Timestamp1(),
          block_count: TestData.Valid.Height1(),
        },
      },
    });
    expect(result.success).toBe(false);
  });
});
