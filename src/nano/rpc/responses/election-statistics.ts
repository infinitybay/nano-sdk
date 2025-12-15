import { z } from "zod";

import { NumberString } from "../../types/number";
import { TimestampString } from "../../types/timestamp";
import { UIntString } from "../../types/uint";

export function ElectionStatisticsResponse() {
  return z.object({
    manual: UIntString(),
    priority: UIntString(),
    hinted: UIntString(),
    optimistic: UIntString(),
    total: UIntString(),
    aec_utilization_percentage: NumberString(),
    max_election_age: TimestampString(),
    average_election_age: TimestampString(),
  });
}

export type ElectionStatisticsResponse = z.infer<ReturnType<typeof ElectionStatisticsResponse>>;
