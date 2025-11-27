import { z } from "zod";

export function StatsClearResponse() {
  return z.object({
    success: z.literal(""),
  });
}

export type StatsClearResponse = z.infer<ReturnType<typeof StatsClearResponse>>;
