import { WorkResponse } from "../../../../../src/nano/web-socket/responses/work";
import { TestData } from "../../../test-data";

describe("WorkResponse schema", () => {
  test("validates work response", () => {
    const result = WorkResponse().safeParse({
      topic: "work",
      time: TestData.Valid.Timestamp1(),
      message: {
        success: "true",
        reason: "",
        duration: TestData.Valid.Timestamp2(),
        request: {
          version: "work_1",
          hash: TestData.Valid.Hash1(),
          difficulty: TestData.Valid.WorkDifficulty1(),
          multiplier: "1",
        },
        result: {
          source: "127.0.0.1:7076",
          work: TestData.Valid.Work1(),
          difficulty: TestData.Valid.WorkDifficulty1(),
          multiplier: "1",
        },
        bad_peers: "",
      },
    });
    expect(result.success).toBe(true);
  });

  test("rejects work response with invalid difficulty", () => {
    const result = WorkResponse().safeParse({
      topic: "work",
      time: TestData.Valid.Timestamp1(),
      message: {
        success: "true",
        reason: "",
        duration: TestData.Valid.Timestamp2(),
        request: {
          hash: TestData.Valid.Hash1(),
          difficulty: TestData.Invalid.WorkDifficulty.InvalidCharacters(),
          multiplier: "1",
        },
        bad_peers: "",
      },
    });
    expect(result.success).toBe(false);
  });
});
