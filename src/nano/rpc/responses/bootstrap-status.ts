import { z } from "zod";

import { UIntString } from "../../types/uint";

/*const BootstrapConnections = () =>
  z.object({
    clients: z.string(),
    connections: z.string(),
    idle: z.string(),
    target_connections: z.string(),
    pulls: z.string(),
  });

const BootstrapAttempt = () =>
  z.union([
    z.object({
      id: z.string(),
      mode: z.literal("legacy"),
      started: BooleanString(),
      pulling: z.string(),
      total_blocks: z.string(),
      requeued_pulls: z.string(),
      frontier_pulls: z.string(),
      frontiers_received: BooleanString(),
      frontiers_confirmed: BooleanString(),
      frontiers_confirmation_pending: BooleanString(),
      frontiers_age: z.string(),
      last_account: AccountString(),
      duration: z.string(),
    }),
    z.object({
      id: z.string(),
      mode: z.literal("lazy"),
      started: BooleanString(),
      pulling: z.string(),
      total_blocks: z.string(),
      requeued_pulls: z.string(),
      lazy_blocks: z.string(),
      lazy_state_backlog: z.string(),
      lazy_balances: z.string(),
      lazy_destinations: z.string(),
      lazy_undefined_links: z.string(),
      lazy_pulls: z.string(),
      lazy_keys: z.string(),
      lazy_key_1: z.string(),
      duration: z.string(),
    }),
  ]);*/

export function BootstrapStatusResponse() {
  return z.union([
    /*z.object({
      bootstrap_threads: z.string(),
      running_attempts_count: z.string(),
      total_attempts_count: z.string(),
      connections: BootstrapConnections(),
      attempts: z.array(BootstrapAttempt()),
    }),*/
    z.object({
      priorities: UIntString(),
      blocking: UIntString(),
    }),
  ]);
}

export type BootstrapStatusResponse = z.infer<ReturnType<typeof BootstrapStatusResponse>>;
