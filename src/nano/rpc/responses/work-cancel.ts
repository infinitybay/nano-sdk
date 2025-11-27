import { z } from "zod";

export function WorkCancelResponse() {
  return z.object({
    success: z.literal(""),
  });
}

export type WorkCancelResponse = z.infer<ReturnType<typeof WorkCancelResponse>>;
