import { z } from "zod";

export function ElectionStatisticsRequest() {
  return z.object({
    action: z.literal("election_statistics"),
  });
}

export type ElectionStatisticsRequest = z.infer<ReturnType<typeof ElectionStatisticsRequest>>;
