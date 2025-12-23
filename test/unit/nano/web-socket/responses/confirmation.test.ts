import {
  ConfirmationMessageBlock,
  ConfirmationResponse,
} from "../../../../../src/nano/web-socket/responses/confirmation";
import { TestData } from "../../../test-data";

describe("ConfirmationMessageBlock schema", () => {
  test("validates state block confirmation content", () => {
    const result = ConfirmationMessageBlock().safeParse({
      ...TestData.Valid.StateBlock1(),
      linked_account: TestData.Valid.Account1(),
      subtype: "send",
    });
    expect(result.success).toBe(true);
  });

  test("validates legacy block confirmation content", () => {
    const result = ConfirmationMessageBlock().safeParse({
      type: "open",
      source: TestData.Valid.Hash1(),
      representative: TestData.Valid.Representative1(),
      account: TestData.Valid.Account1(),
      work: TestData.Valid.Work1(),
      signature: TestData.Valid.Signature1(),
      linked_account: TestData.Valid.Account1(),
    });
    expect(result.success).toBe(true);
  });

  test("rejects confirmation content with missing required fields", () => {
    const result = ConfirmationMessageBlock().safeParse({
      type: "state",
      account: TestData.Valid.Account1(),
    });
    expect(result.success).toBe(false);
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
    expect(result.success).toBe(true);
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
    expect(result.success).toBe(false);
  });
});
