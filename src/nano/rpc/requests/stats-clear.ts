import { z } from "zod";

export function StatsClearRequest() {
  return z.object({
    action: z.literal("stats_clear"),
  });
}

export type StatsClearRequest = z.infer<ReturnType<typeof StatsClearRequest>>;
