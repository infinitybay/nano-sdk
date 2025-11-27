import { z } from "zod";

export function StopResponse() {
  return z.object({
    success: z.literal(""),
  });
}

export type StopResponse = z.infer<ReturnType<typeof StopResponse>>;
