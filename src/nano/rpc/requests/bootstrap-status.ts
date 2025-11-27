import { z } from "zod";

export function BootstrapStatusRequest() {
  return z.object({
    action: z.literal("bootstrap_status"),
  });
}

export type BootstrapStatusRequest = z.infer<ReturnType<typeof BootstrapStatusRequest>>;
