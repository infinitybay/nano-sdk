import { ConfirmationInfoResponse } from "../../../../../src/nano/rpc/responses/confirmation-info";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("ConfirmationInfoResponse schema", () => {
  test("parses confirmation info response with all options disabled", () => {
    const schema = ConfirmationInfoResponse({
      contents: false,
      json_block: false,
      representatives: false,
    });
    const result = schema.safeParse({
      announcements: "1",
      voters: "1",
      last_winner: TestData.Valid.Hash1(),
      total_tally: TestData.Valid.RawAmount1(),
      final_tally: TestData.Valid.RawAmount2(),
      blocks: {
        [TestData.Valid.Hash1()]: {
          tally: TestData.Valid.RawAmount3(),
        },
      },
    });
    assert(result.success);
    expect(result.data.announcements).toBe("1");
    expect(result.data.voters).toBe("1");
  });

  test("parses confirmation info response with string block", () => {
    const schema = ConfirmationInfoResponse({
      contents: true,
      json_block: false,
      representatives: false,
    });
    const result = schema.safeParse({
      announcements: "1",
      voters: "1",
      last_winner: TestData.Valid.Hash1(),
      total_tally: TestData.Valid.RawAmount1(),
      final_tally: TestData.Valid.RawAmount2(),
      blocks: {
        [TestData.Valid.Hash1()]: {
          tally: TestData.Valid.RawAmount3(),
          contents: "string-block",
        },
      },
    });
    assert(result.success);
    expect(result.data.announcements).toBe("1");
    expect(result.data.voters).toBe("1");
  });

  test("parses confirmation info response with contents, json block and representatives", () => {
    const schema = ConfirmationInfoResponse({
      contents: true,
      json_block: true,
      representatives: true,
    });
    const result = schema.safeParse({
      announcements: "1",
      voters: "1",
      last_winner: TestData.Valid.Hash1(),
      total_tally: TestData.Valid.RawAmount1(),
      final_tally: TestData.Valid.RawAmount2(),
      blocks: {
        [TestData.Valid.Hash1()]: {
          tally: TestData.Valid.RawAmount3(),
          contents: TestData.Valid.StateBlock1(),
          representatives: {
            [TestData.Valid.Representative1()]: TestData.Valid.RawAmount1(),
          },
          representatives_final: {
            [TestData.Valid.Representative2()]: TestData.Valid.RawAmount2(),
          },
        },
      },
    });
    assert(result.success);
    expect(result.data.announcements).toBe("1");
    expect(result.data.voters).toBe("1");
  });

  test.each(["representatives", "representatives_final"] as const)(
    "parses confirmation info response with empty %s map",
    (emptyField) => {
      const schema = ConfirmationInfoResponse({
        contents: false,
        json_block: false,
        representatives: true,
      });
      const result = schema.safeParse({
        announcements: "1",
        voters: "1",
        last_winner: TestData.Valid.Hash1(),
        total_tally: TestData.Valid.RawAmount1(),
        final_tally: TestData.Valid.RawAmount2(),
        blocks: {
          [TestData.Valid.Hash1()]: {
            tally: TestData.Valid.RawAmount3(),
            representatives:
              emptyField === "representatives"
                ? ""
                : { [TestData.Valid.Representative1()]: TestData.Valid.RawAmount1() },
            representatives_final:
              emptyField === "representatives_final"
                ? ""
                : { [TestData.Valid.Representative2()]: TestData.Valid.RawAmount2() },
          },
        },
      });
      assert(result.success);
      expect(result.data.blocks[TestData.Valid.Hash1()]?.[emptyField]).toBe("");
    }
  );

  test("rejects confirmation info response with invalid block hash", () => {
    const schema = ConfirmationInfoResponse({
      contents: false,
      json_block: false,
      representatives: false,
    });
    const result = schema.safeParse({
      announcements: "1",
      voters: "1",
      last_winner: TestData.Valid.Hash1(),
      total_tally: TestData.Valid.RawAmount1(),
      final_tally: TestData.Valid.RawAmount2(),
      blocks: {
        [TestData.Invalid.Hash.InvalidCharacters()]: {
          tally: TestData.Valid.RawAmount3(),
        },
      },
    });
    assert(!result.success);
  });

  test("rejects a non-empty string as a representative map", () => {
    const schema = ConfirmationInfoResponse({
      contents: false,
      json_block: false,
      representatives: true,
    });
    const result = schema.safeParse({
      announcements: "1",
      voters: "1",
      last_winner: TestData.Valid.Hash1(),
      total_tally: TestData.Valid.RawAmount1(),
      final_tally: TestData.Valid.RawAmount2(),
      blocks: {
        [TestData.Valid.Hash1()]: {
          tally: TestData.Valid.RawAmount3(),
          representatives: "not-empty",
          representatives_final: "",
        },
      },
    });
    assert(!result.success);
  });
});
