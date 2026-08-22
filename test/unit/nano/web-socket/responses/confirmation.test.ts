import {
  ConfirmationMessageBlock,
  ConfirmationResponse,
} from "../../../../../src/nano/web-socket/responses/confirmation";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("ConfirmationMessageBlock schema", () => {
  test("validates state block confirmation content", () => {
    const result = ConfirmationMessageBlock().safeParse({
      ...TestData.Valid.StateBlock1(),
      linked_account: TestData.Valid.Account1(),
      subtype: "send",
    });
    assert(result.success);
  });

  test("validates an unavailable linked account", () => {
    const result = ConfirmationMessageBlock().safeParse({
      ...TestData.Valid.StateBlock1(),
      linked_account: "0",
      subtype: "change",
    });
    assert(result.success);
    expect(result.data.linked_account).toBe("0");
  });

  test.each([
    ["change", TestData.Valid.LegacyChangeBlock()],
    ["open", TestData.Valid.LegacyOpenBlock()],
    ["receive", TestData.Valid.LegacyReceiveBlock()],
    ["send", TestData.Valid.LegacySendBlock()],
  ] as const)("validates a legacy %s block without a subtype", (_type, block) => {
    const result = ConfirmationMessageBlock().safeParse({
      ...block,
      linked_account: TestData.Valid.Account1(),
    });
    assert(result.success);
  });

  test.each(["change", "epoch", "receive", "send"])("validates the %s state subtype", (subtype) => {
    const result = ConfirmationMessageBlock().safeParse({
      ...TestData.Valid.StateBlock1(),
      subtype,
    });
    assert(result.success);
    assert(result.data.type === "state");
    expect(result.data.subtype).toBe(subtype);
  });

  test.each([undefined, "unknown"])("rejects the %s state subtype", (subtype) => {
    const result = ConfirmationMessageBlock().safeParse({
      ...TestData.Valid.StateBlock1(),
      subtype,
    });
    assert(!result.success);
  });

  test("rejects an empty linked account", () => {
    const result = ConfirmationMessageBlock().safeParse({
      ...TestData.Valid.StateBlock1(),
      linked_account: "",
      subtype: "send",
    });
    assert(!result.success);
  });

  test("rejects confirmation content with missing required fields", () => {
    const result = ConfirmationMessageBlock().safeParse({
      type: "state",
      account: TestData.Valid.Account1(),
    });
    assert(!result.success);
  });
});

describe("ConfirmationResponse schema", () => {
  test("validates confirmation response with election info and sideband", () => {
    const result = ConfirmationResponse().safeParse({
      topic: "confirmation",
      time: TestData.Valid.Timestamp1(),
      message: {
        account: TestData.Valid.Account1(),
        amount: TestData.Valid.RawAmount1(),
        hash: TestData.Valid.Hash1(),
        confirmation_type: "active_quorum",
        block: {
          ...TestData.Valid.StateBlock1(),
          linked_account: TestData.Valid.Account1(),
          subtype: "receive",
        },
        election_info: {
          duration: TestData.Valid.Timestamp1(),
          time: TestData.Valid.Timestamp1(),
          tally: TestData.Valid.RawAmount1(),
          final: TestData.Valid.RawAmount1(),
          blocks: "0",
          voters: "0",
          request_count: "0",
          votes: [
            {
              representative: TestData.Valid.Account1(),
              timestamp: TestData.Valid.Timestamp1(),
              hash: TestData.Valid.Hash1(),
              weight: TestData.Valid.RawAmount1(),
            },
          ],
        },
        sideband: {
          height: TestData.Valid.Height1(),
          local_timestamp: TestData.Valid.Timestamp1(),
        },
      },
    });
    assert(result.success);
  });

  test("rejects confirmation response with invalid hash", () => {
    const result = ConfirmationResponse().safeParse({
      topic: "confirmation",
      time: TestData.Valid.Timestamp1(),
      message: {
        account: TestData.Valid.Account1(),
        amount: TestData.Valid.RawAmount1(),
        hash: TestData.Invalid.Hash.InvalidCharacters(),
        confirmation_type: "active",
      },
    });
    assert(!result.success);
  });
});
