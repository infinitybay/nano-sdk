import { z } from "zod";

export function BootstrapResetRequest() {
  return z.object({
    action: z.literal("bootstrap_reset"),
  });
}

export type BootstrapResetRequest = z.infer<ReturnType<typeof BootstrapResetRequest>>;
