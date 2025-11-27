import "../../../zod-extensions";

import { z } from "zod";

import { NumberString } from "../../types/number";
import { TimestampString } from "../../types/timestamp";
import { UIntString } from "../../types/uint";

export function ElectionStatisticsResponse() {
  return z.object({
    manual: UIntString().transformToUInt(),
    priority: UIntString().transformToUInt(),
    hinted: UIntString().transformToUInt(),
    optimistic: UIntString().transformToUInt(),
    total: UIntString().transformToUInt(),
    aec_utilization_percentage: NumberString().transformToNumber(),
    max_election_age: TimestampString(),
    average_election_age: TimestampString(),
  });
}

export type ElectionStatisticsResponse = z.infer<ReturnType<typeof ElectionStatisticsResponse>>;
