import { z } from "zod";

export function BootstrapResetResponse() {
  return z.object({
    success: z.literal(""),
  });
}

export type BootstrapResetResponse = z.infer<ReturnType<typeof BootstrapResetResponse>>;
