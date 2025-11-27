import { z } from "zod";

export function StopRequest() {
  return z.object({
    action: z.literal("stop"),
  });
}

export type StopRequest = z.infer<ReturnType<typeof StopRequest>>;
