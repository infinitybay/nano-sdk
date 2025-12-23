import { StoppedElectionRequest } from "../../../../../src/nano/web-socket/requests/stopped-election";

describe("StoppedElectionRequest schema", () => {
  test("validates stopped election request", () => {
    const result = StoppedElectionRequest().safeParse({ action: "subscribe", topic: "stopped_election" });
    expect(result.success).toBe(true);
  });

  test("rejects stopped election request with invalid topic", () => {
    const result = StoppedElectionRequest().safeParse({ action: "subscribe", topic: "started_election" });
    expect(result.success).toBe(false);
  });
});
