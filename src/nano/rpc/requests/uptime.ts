import { z } from "zod";

export function UptimeRequest() {
  return z.object({
    action: z.literal("uptime"),
  });
}

export type UptimeRequest = z.infer<ReturnType<typeof UptimeRequest>>;
