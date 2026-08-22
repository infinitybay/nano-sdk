import { WorkResponse } from "../../../../../src/nano/web-socket/responses/work";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("WorkResponse schema", () => {
  const validRequest = () => ({
    version: "work_1",
    hash: TestData.Valid.Hash1(),
    difficulty: TestData.Valid.WorkDifficulty1(),
    multiplier: "1",
  });

  const validResult = () => ({
    source: "127.0.0.1:7076",
    work: TestData.Valid.Work1(),
    difficulty: TestData.Valid.WorkDifficulty1(),
    multiplier: "1",
  });

  test("validates a successful work response with a result", () => {
    const result = WorkResponse().safeParse({
      topic: "work",
      time: TestData.Valid.Timestamp1(),
      message: {
        success: "true",
        reason: "",
        duration: TestData.Valid.Timestamp2(),
        request: validRequest(),
        result: validResult(),
        bad_peers: "",
      },
    });
    assert(result.success);
    expect(result.data.message.success).toBe("true");
    if (result.data.message.success === "true") {
      expect(result.data.message.result.work).toBe(TestData.Valid.Work1());
    }
  });

  test.each(["cancelled", "failure"] as const)("validates an unsuccessful work response with reason %s", (reason) => {
    const result = WorkResponse().safeParse({
      topic: "work",
      time: TestData.Valid.Timestamp1(),
      message: {
        success: "false",
        reason,
        duration: TestData.Valid.Timestamp2(),
        request: validRequest(),
        bad_peers: "",
      },
    });
    assert(result.success);
    expect(result.data.message.success).toBe("false");
    if (result.data.message.success === "false") {
      expect(result.data.message.result).toBeUndefined();
    }
  });

  test.each([
    { success: "true", reason: "failure", result: validResult() },
    { success: "false", reason: "", result: undefined },
  ])("rejects a work response with incompatible success and reason values", ({ success, reason, result }) => {
    const response = WorkResponse().safeParse({
      topic: "work",
      time: TestData.Valid.Timestamp1(),
      message: {
        success,
        reason,
        duration: TestData.Valid.Timestamp2(),
        request: validRequest(),
        result,
        bad_peers: "",
      },
    });
    assert(!response.success);
  });

  test("rejects a work response without a request version", () => {
    const request = validRequest();
    const { version: _version, ...requestWithoutVersion } = request;
    const result = WorkResponse().safeParse({
      topic: "work",
      time: TestData.Valid.Timestamp1(),
      message: {
        success: "true",
        reason: "",
        duration: TestData.Valid.Timestamp2(),
        request: requestWithoutVersion,
        result: validResult(),
        bad_peers: "",
      },
    });
    assert(!result.success);
  });

  test("rejects a successful work response without a result", () => {
    const result = WorkResponse().safeParse({
      topic: "work",
      time: TestData.Valid.Timestamp1(),
      message: {
        success: "true",
        reason: "",
        duration: TestData.Valid.Timestamp2(),
        request: validRequest(),
        bad_peers: "",
      },
    });
    assert(!result.success);
  });

  test("rejects an unsuccessful work response with a result", () => {
    const result = WorkResponse().safeParse({
      topic: "work",
      time: TestData.Valid.Timestamp1(),
      message: {
        success: "false",
        reason: "failure",
        duration: TestData.Valid.Timestamp2(),
        request: validRequest(),
        result: validResult(),
        bad_peers: "",
      },
    });
    assert(!result.success);
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
          version: "work_1",
          hash: TestData.Valid.Hash1(),
          difficulty: TestData.Invalid.WorkDifficulty.InvalidCharacters(),
          multiplier: "1",
        },
        result: validResult(),
        bad_peers: "",
      },
    });
    assert(!result.success);
  });
});
