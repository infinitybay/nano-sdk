import {
  StartedElectionMessage,
  StartedElectionResponse,
} from "../../../../../src/nano/web-socket/responses/started-election";
import { TestData } from "../../../test-data";

describe("StartedElectionMessage schema", () => {
  test("validates started election message", () => {
    const result = StartedElectionMessage().safeParse({ hash: TestData.Valid.Hash1() });
    expect(result.success).toBe(true);
  });

  test("rejects started election message with invalid hash", () => {
    const result = StartedElectionMessage().safeParse({ hash: TestData.Invalid.Hash.InvalidCharacters() });
    expect(result.success).toBe(false);
  });
});

describe("StartedElectionResponse schema", () => {
  test("validates started election response", () => {
    const result = StartedElectionResponse().safeParse({
      topic: "started_election",
      time: TestData.Valid.Timestamp1(),
      message: { hash: TestData.Valid.Hash2() },
    });
    expect(result.success).toBe(true);
  });

  test("rejects started election response with invalid time", () => {
    const result = StartedElectionResponse().safeParse({
      topic: "started_election",
      time: "-1",
      message: { hash: TestData.Valid.Hash2() },
    });
    expect(result.success).toBe(false);
  });
});
