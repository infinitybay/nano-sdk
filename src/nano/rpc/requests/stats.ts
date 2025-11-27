import { z } from "zod";

export function StatsRequest() {
  return z.object({
    action: z.literal("stats"),
    type: z.union([z.literal("counters"), z.literal("samples"), z.literal("objects"), z.literal("database")]),
  });
}

export type StatsRequest = z.infer<ReturnType<typeof StatsRequest>>;
