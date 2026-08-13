import {
  StoppedElectionMessage,
  StoppedElectionResponse,
} from "../../../../../src/nano/web-socket/responses/stopped-election";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("StoppedElectionMessage schema", () => {
  test("validates stopped election message", () => {
    const result = StoppedElectionMessage().safeParse({ hash: TestData.Valid.Hash1() });
    assert(result.success);
  });

  test("rejects stopped election message with invalid hash", () => {
    const result = StoppedElectionMessage().safeParse({ hash: TestData.Invalid.Hash.InvalidCharacters() });
    assert(!result.success);
  });
});

describe("StoppedElectionResponse schema", () => {
  test("validates stopped election response", () => {
    const result = StoppedElectionResponse().safeParse({
      topic: "stopped_election",
      time: TestData.Valid.Timestamp1(),
      message: { hash: TestData.Valid.Hash2() },
    });
    assert(result.success);
  });

  test("rejects stopped election response with invalid time", () => {
    const result = StoppedElectionResponse().safeParse({
      topic: "stopped_election",
      time: "-1",
      message: { hash: TestData.Valid.Hash2() },
    });
    assert(!result.success);
  });
});
