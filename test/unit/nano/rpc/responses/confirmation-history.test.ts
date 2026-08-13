import { ConfirmationHistoryResponse } from "../../../../../src/nano/rpc/responses/confirmation-history";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("ConfirmationHistoryResponse schema", () => {
  test("parses empty confirmation history response", () => {
    const result = ConfirmationHistoryResponse().safeParse({
      confirmation_stats: {
        count: "0",
      },
      confirmations: "",
    });
    assert(result.success);
  });

  test("parses confirmation history response", () => {
    const result = ConfirmationHistoryResponse().safeParse({
      confirmation_stats: {
        count: "1",
        average: "1",
      },
      confirmations: [
        {
          hash: TestData.Valid.Hash1(),
          duration: TestData.Valid.Timestamp1(),
          time: TestData.Valid.Timestamp2(),
          tally: TestData.Valid.RawAmount1(),
          final: TestData.Valid.RawAmount2(),
          blocks: "1",
          voters: "1",
          request_count: "1",
        },
      ],
    });
    assert(result.success);
  });

  test("rejects confirmation history response with invalid hash", () => {
    const result = ConfirmationHistoryResponse().safeParse({
      confirmation_stats: {
        count: "1",
        average: "1",
      },
      confirmations: [
        {
          hash: TestData.Invalid.Hash.InvalidCharacters(),
          duration: TestData.Valid.Timestamp1(),
          time: TestData.Valid.Timestamp2(),
          tally: TestData.Valid.RawAmount1(),
          final: TestData.Valid.RawAmount2(),
          blocks: "1",
          voters: "1",
          request_count: TestData.Valid.RawAmount1(),
        },
      ],
    });
    assert(!result.success);
  });
});
