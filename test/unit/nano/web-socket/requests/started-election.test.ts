import { StartedElectionRequest } from "../../../../../src/nano/web-socket/requests/started-election";
import { assert } from "../../../../assert";

describe("StartedElectionRequest schema", () => {
  test("validates started election request", () => {
    const result = StartedElectionRequest().safeParse({ action: "subscribe", topic: "started_election", ack: true });
    assert(result.success);
  });

  test("rejects started election request with invalid topic", () => {
    const result = StartedElectionRequest().safeParse({ action: "subscribe", topic: "stopped_election" });
    assert(!result.success);
  });
});
