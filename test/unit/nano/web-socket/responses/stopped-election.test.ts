import {
  StoppedElectionMessage,
  StoppedElectionResponse,
} from "../../../../../src/nano/web-socket/responses/stopped-election";
import { TestData } from "../../../test-data";

describe("StoppedElectionMessage schema", () => {
  test("validates stopped election message", () => {
    const result = StoppedElectionMessage().safeParse({ hash: TestData.Valid.Hash1() });
    expect(result.success).toBe(true);
  });

  test("rejects stopped election message with invalid hash", () => {
    const result = StoppedElectionMessage().safeParse({ hash: TestData.Invalid.Hash.InvalidCharacters() });
    expect(result.success).toBe(false);
  });
});

describe("StoppedElectionResponse schema", () => {
  test("validates stopped election response", () => {
    const result = StoppedElectionResponse().safeParse({
      topic: "stopped_election",
      time: TestData.Valid.Timestamp1(),
      message: { hash: TestData.Valid.Hash2() },
    });
    expect(result.success).toBe(true);
  });

  test("rejects stopped election response with invalid time", () => {
    const result = StoppedElectionResponse().safeParse({
      topic: "stopped_election",
      time: "-1",
      message: { hash: TestData.Valid.Hash2() },
    });
    expect(result.success).toBe(false);
  });
});
