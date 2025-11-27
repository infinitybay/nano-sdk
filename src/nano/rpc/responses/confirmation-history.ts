import "../../../zod-extensions";

import { z } from "zod";

import { AmountString } from "../../types/amount";
import { HashString } from "../../types/hash";
import { NumberString } from "../../types/number";
import { TimestampString } from "../../types/timestamp";
import { UIntString } from "../../types/uint";

export function ConfirmationHistoryResponse() {
  return z.object({
    confirmation_stats: z.object({
      count: UIntString().transformToUInt(),
      average: NumberString().transformToNumber().optional(),
    }),
    confirmations: z
      .object({
        hash: HashString(),
        duration: TimestampString(),
        time: TimestampString(),
        tally: AmountString(),
        final: AmountString(),
        blocks: UIntString().transformToUInt(),
        voters: UIntString().transformToUInt(),
        request_count: UIntString().transformToUInt(),
      })
      .array()
      .or(z.literal("")),
  });
}

export type ConfirmationHistoryResponse = z.infer<ReturnType<typeof ConfirmationHistoryResponse>>;
