import { z } from "zod";

export function PopulateBacklogResponse() {
  return z.object({
    success: z.literal(""),
  });
}

export type PopulateBacklogResponse = z.infer<ReturnType<typeof PopulateBacklogResponse>>;
