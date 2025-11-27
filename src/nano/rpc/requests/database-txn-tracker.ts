import { z } from "zod";

import { Timestamp, TimestampString } from "../../types/timestamp";

export function DatabaseTxnTrackerRequest() {
  return z.object({
    action: z.literal("database_txn_tracker"),
    min_read_time: TimestampString().or(Timestamp()),
    min_write_time: TimestampString().or(Timestamp()),
  });
}

export type DatabaseTxnTrackerRequest = z.infer<ReturnType<typeof DatabaseTxnTrackerRequest>>;
