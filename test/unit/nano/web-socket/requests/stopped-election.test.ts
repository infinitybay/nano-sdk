import { StoppedElectionRequest } from "../../../../../src/nano/web-socket/requests/stopped-election";
import { assert } from "../../../../assert";

describe("StoppedElectionRequest schema", () => {
  test("validates stopped election request", () => {
    const result = StoppedElectionRequest().safeParse({ action: "subscribe", topic: "stopped_election" });
    assert(result.success);
  });

  test("rejects stopped election request with invalid topic", () => {
    const result = StoppedElectionRequest().safeParse({ action: "subscribe", topic: "started_election" });
    assert(!result.success);
  });
});
