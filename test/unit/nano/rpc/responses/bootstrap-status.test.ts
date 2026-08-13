import { BootstrapStatusResponse } from "../../../../../src/nano/rpc/responses/bootstrap-status";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("BootstrapStatusResponse schema", () => {
  test("parses bootstrap status response", () => {
    const result = BootstrapStatusResponse().safeParse({
      priorities: "0",
      blocking: "0",
    });
    assert(result.success);
  });

  // Disabled: Legacy
  xtest("parses bootstrap status response", () => {
    const result = BootstrapStatusResponse().safeParse({
      bootstrap_threads: "4",
      running_attempts_count: "1",
      total_attempts_count: "1",
      connections: {
        clients: "128",
        connections: "128",
        idle: "4",
        target_connections: "128",
        pulls: "4",
      },
      attempts: [
        {
          id: "1",
          mode: "legacy",
          started: "true",
          pulling: "4",
          total_blocks: "1",
          requeued_pulls: "4",
          frontier_pulls: "4",
          frontiers_received: "true",
          frontiers_confirmed: "true",
          frontiers_confirmation_pending: "true",
          frontiers_age: TestData.Valid.Timestamp1(),
          last_account: TestData.Valid.Account1(),
          duration: TestData.Valid.Timestamp2(),
        },
        {
          id: "2",
          mode: "lazy",
          started: "true",
          pulling: "4",
          total_blocks: "1",
          requeued_pulls: "1",
          lazy_blocks: "1",
          lazy_state_backlog: "1",
          lazy_balances: "1",
          lazy_destinations: "1",
          lazy_undefined_links: "1",
          lazy_pulls: "1",
          lazy_keys: "1",
          lazy_key_1: "1",
          duration: TestData.Valid.Timestamp1(),
        },
      ],
    });
    assert(result.success);
  });
});
