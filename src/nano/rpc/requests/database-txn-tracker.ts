import { z } from "zod";

import { TimestampString } from "../../types/timestamp";

export function DatabaseTxnTrackerRequest() {
  return z.object({
    action: z.literal("database_txn_tracker"),
    min_read_time: TimestampString(),
    min_write_time: TimestampString(),
  });
}

export type DatabaseTxnTrackerRequest = z.infer<ReturnType<typeof DatabaseTxnTrackerRequest>>;
