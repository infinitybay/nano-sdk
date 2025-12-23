import {
  NewUnconfirmedBlockMessage,
  NewUnconfirmedBlockResponse,
} from "../../../../../src/nano/web-socket/responses/new-unconfirmed-block";
import { TestData } from "../../../test-data";

describe("NewUnconfirmedBlockMessage schema", () => {
  test("validates new unconfirmed block message with state block", () => {
    const result = NewUnconfirmedBlockMessage().safeParse({
      ...TestData.Valid.StateBlock1(),
      subtype: "send",
    });
    expect(result.success).toBe(true);
  });

  test("validates new unconfirmed block message with legacy block", () => {
    const result = NewUnconfirmedBlockMessage().safeParse(TestData.Valid.LegacyOpenBlock());
    expect(result.success).toBe(true);
  });

  test("rejects new unconfirmed block message with missing fields", () => {
    const result = NewUnconfirmedBlockMessage().safeParse({ type: "state" });
    expect(result.success).toBe(false);
  });
});

describe("NewUnconfirmedBlockResponse schema", () => {
  test("validates new unconfirmed block response", () => {
    const result = NewUnconfirmedBlockResponse().safeParse({
      topic: "new_unconfirmed_block",
      time: TestData.Valid.Timestamp1(),
      hash: TestData.Valid.Hash1(),
      message: {
        ...TestData.Valid.StateBlock2(),
        subtype: "receive",
      },
    });
    expect(result.success).toBe(true);
  });

  test("rejects new unconfirmed block response with invalid hash", () => {
    const result = NewUnconfirmedBlockResponse().safeParse({
      topic: "new_unconfirmed_block",
      time: TestData.Valid.Timestamp1(),
      hash: TestData.Invalid.Hash.InvalidCharacters(),
      message: {
        ...TestData.Valid.StateBlock2(),
        subtype: "receive",
      },
    });
    expect(result.success).toBe(false);
  });
});
