import { z } from "zod";

import { RawAmountString } from "../../types/amount";
import { HashString } from "../../types/hash";
import { NumberString } from "../../types/number";
import { TimestampString } from "../../types/timestamp";
import { UIntString } from "../../types/uint";

export function ConfirmationHistoryResponse() {
  return z.object({
    confirmation_stats: z.object({
      count: UIntString(),
      average: NumberString().optional(),
    }),
    confirmations: z
      .object({
        hash: HashString(),
        duration: TimestampString(),
        time: TimestampString(),
        tally: RawAmountString(),
        final: RawAmountString(),
        blocks: UIntString(),
        voters: UIntString(),
        request_count: UIntString(),
      })
      .array()
      .or(z.literal("")),
  });
}

export type ConfirmationHistoryResponse = z.infer<ReturnType<typeof ConfirmationHistoryResponse>>;
