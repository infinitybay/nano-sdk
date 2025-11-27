import { z } from "zod";

export function PopulateBacklogRequest() {
  return z.object({
    action: z.literal("populate_backlog"),
  });
}

export type PopulateBacklogRequest = z.infer<ReturnType<typeof PopulateBacklogRequest>>;
