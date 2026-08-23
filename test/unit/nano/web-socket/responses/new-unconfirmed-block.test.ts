import {
  NewUnconfirmedBlockMessage,
  NewUnconfirmedBlockResponse,
  NewUnconfirmedBlockSubtype,
} from "../../../../../src/nano/web-socket/responses/new-unconfirmed-block";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("NewUnconfirmedBlockSubtype schema", () => {
  test("validates allowed subtype values", () => {
    const validSubtypes = ["change", "epoch", "receive", "send"];
    for (const validSubtype of validSubtypes) {
      expect(NewUnconfirmedBlockSubtype().parse(validSubtype)).toBe(validSubtype);
    }
  });

  test("rejects unknown subtype", () => {
    assert(!NewUnconfirmedBlockSubtype().safeParse("unknown").success);
  });
});

describe("NewUnconfirmedBlockMessage schema", () => {
  test("validates new unconfirmed block message with state block", () => {
    const result = NewUnconfirmedBlockMessage().safeParse({
      ...TestData.Valid.StateBlock1(),
      subtype: "send",
    });
    assert(result.success);
  });

  test("validates every legacy block without subtype", () => {
    const legacyBlocks = [
      TestData.Valid.LegacyChangeBlock(),
      TestData.Valid.LegacyOpenBlock(),
      TestData.Valid.LegacyReceiveBlock(),
      TestData.Valid.LegacySendBlock(),
    ];

    for (const legacyBlock of legacyBlocks) {
      assert(NewUnconfirmedBlockMessage().safeParse(legacyBlock).success);
    }
  });

  test("strips subtype from every legacy block", () => {
    const legacyBlocks = [
      TestData.Valid.LegacyChangeBlock(),
      TestData.Valid.LegacyOpenBlock(),
      TestData.Valid.LegacyReceiveBlock(),
      TestData.Valid.LegacySendBlock(),
    ];

    for (const legacyBlock of legacyBlocks) {
      const result = NewUnconfirmedBlockMessage().safeParse({
        ...legacyBlock,
        subtype: "change",
      });
      assert(result.success);
      expect(result.data).not.toHaveProperty("subtype");
    }
  });

  test("rejects new unconfirmed block message with missing fields", () => {
    const result = NewUnconfirmedBlockMessage().safeParse({ type: "state" });
    assert(!result.success);
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
    assert(result.success);
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
    assert(!result.success);
  });
});
