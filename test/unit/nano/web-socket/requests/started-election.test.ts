import { StartedElectionRequest } from "../../../../../src/nano/web-socket/requests/started-election";

describe("StartedElectionRequest schema", () => {
  test("validates started election request", () => {
    const result = StartedElectionRequest().safeParse({ action: "subscribe", topic: "started_election", ack: true });
    expect(result.success).toBe(true);
  });

  test("rejects started election request with invalid topic", () => {
    const result = StartedElectionRequest().safeParse({ action: "subscribe", topic: "stopped_election" });
    expect(result.success).toBe(false);
  });
});
