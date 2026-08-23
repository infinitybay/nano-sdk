import { z } from "zod";

import { BooleanString } from "../../types/boolean";
import { TimestampString } from "../../types/timestamp";
import { UIntString } from "../../types/uint";

const TxnStackFrame = () =>
  z.object({
    name: z.string(),
    address: z.string(),
    source_file: z.string(),
    source_line: UIntString(),
  });

const TxnTrackingEntry = () =>
  z.object({
    thread: z.string(),
    time_held_open: TimestampString(),
    write: BooleanString(),
    stacktrace: z.array(TxnStackFrame()),
  });

export function DatabaseTxnTrackerResponse() {
  return z.object({
    txn_tracking: z.array(TxnTrackingEntry()).or(z.literal("")),
  });
}

export type DatabaseTxnTrackerResponse = z.infer<ReturnType<typeof DatabaseTxnTrackerResponse>>;
