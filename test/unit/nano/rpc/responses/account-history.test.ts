import { AccountHistoryResponse } from "../../../../../src/nano/rpc/responses/account-history";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("AccountHistoryResponse schema", () => {
  test("parses account history response with linked account", () => {
    const schema = AccountHistoryResponse({
      include_linked_account: true,
      raw: false,
      reverse: false,
    });
    const result = schema.safeParse({
      account: TestData.Valid.Account1(),
      history: [
        {
          type: "send",
          account: TestData.Valid.Account1(),
          amount: TestData.Valid.RawAmount1(),
          local_timestamp: TestData.Valid.Timestamp1(),
          height: TestData.Valid.Height1(),
          hash: TestData.Valid.Hash1(),
          confirmed: "true",
          linked_account: TestData.Valid.Account2(),
        },
      ],
      previous: TestData.Valid.PrevHash1(),
    });
    assert(result.success);
    expect(result.data.previous).toBe(TestData.Valid.PrevHash1());
  });

  test("parses account history response with linked account and raw", () => {
    const schema = AccountHistoryResponse({
      include_linked_account: true,
      raw: true,
      reverse: false,
    });
    const result = schema.safeParse({
      account: TestData.Valid.Account1(),
      history: [
        {
          ...TestData.Valid.StateBlock1(),
          subtype: "receive",
          amount: TestData.Valid.RawAmount1(),
          local_timestamp: TestData.Valid.Timestamp1(),
          height: TestData.Valid.Height1(),
          hash: TestData.Valid.Hash1(),
          confirmed: "true",
          linked_account: TestData.Valid.Account2(),
        },
      ],
      previous: TestData.Valid.PrevHash1(),
    });
    assert(result.success);
    expect(result.data.previous).toBe(TestData.Valid.PrevHash1());
  });

  test("parses account history response without linked account and with raw", () => {
    const schema = AccountHistoryResponse({
      include_linked_account: false,
      raw: true,
      reverse: false,
    });
    const result = schema.safeParse({
      account: TestData.Valid.Account1(),
      history: [
        {
          ...TestData.Valid.StateBlock1(),
          subtype: "receive",
          amount: TestData.Valid.RawAmount1(),
          local_timestamp: TestData.Valid.Timestamp1(),
          height: TestData.Valid.Height1(),
          hash: TestData.Valid.Hash1(),
          confirmed: "true",
        },
      ],
      previous: TestData.Valid.PrevHash1(),
    });
    assert(result.success);
  });

  test("parses an unknown raw state subtype when the previous block is pruned", () => {
    const schema = AccountHistoryResponse({
      include_linked_account: false,
      raw: true,
      reverse: false,
    });
    const result = schema.safeParse({
      account: TestData.Valid.Account1(),
      history: [
        {
          ...TestData.Valid.StateBlock1(),
          subtype: "unknown",
          local_timestamp: TestData.Valid.Timestamp1(),
          height: TestData.Valid.Height1(),
          hash: TestData.Valid.Hash1(),
          confirmed: "true",
        },
      ],
      previous: TestData.Valid.PrevHash1(),
    });
    assert(result.success);
    expect(result.data.history).not.toBe("");
    if (result.data.history !== "") {
      const entry = result.data.history[0];
      assert(entry?.type === "state");
      expect(entry.subtype).toBe("unknown");
    }
  });

  test("parses account history response with reverse flag and raw", () => {
    const schema = AccountHistoryResponse({
      include_linked_account: false,
      raw: true,
      reverse: true,
    });
    const result = schema.safeParse({
      account: TestData.Valid.Account1(),
      history: [
        {
          ...TestData.Valid.StateBlock1(),
          subtype: "receive",
          amount: TestData.Valid.RawAmount1(),
          local_timestamp: TestData.Valid.Timestamp1(),
          height: TestData.Valid.Height1(),
          hash: TestData.Valid.Hash1(),
          confirmed: "true",
        },
      ],
      next: TestData.Valid.Hash1(),
    });
    assert(result.success);
  });

  test("rejects account history response with invalid history entry", () => {
    const schema = AccountHistoryResponse({
      include_linked_account: false,
      raw: true,
      reverse: false,
    });
    const result = schema.safeParse({
      account: TestData.Valid.Account1(),
      history: [
        {
          ...TestData.Valid.StateBlock1(),
          subtype: "invalid",
          amount: TestData.Valid.RawAmount1(),
          local_timestamp: TestData.Valid.Timestamp1(),
          height: TestData.Valid.Height1(),
          hash: TestData.Valid.Hash1(),
          confirmed: "true",
        },
      ],
      previous: TestData.Valid.PrevHash1(),
    });
    assert(!result.success);
  });

  test("rejects account history response with missing linked account", () => {
    const schema = AccountHistoryResponse({
      include_linked_account: true,
      raw: true,
      reverse: false,
    });
    const result = schema.safeParse({
      account: TestData.Valid.Account1(),
      history: [
        {
          ...TestData.Valid.StateBlock1(),
          subtype: "receive",
          amount: TestData.Valid.RawAmount1(),
          local_timestamp: TestData.Valid.Timestamp1(),
          height: TestData.Valid.Height1(),
          hash: TestData.Valid.Hash1(),
          confirmed: "true",
        },
      ],
      previous: TestData.Valid.PrevHash1(),
    });
    assert(!result.success);
  });
});
