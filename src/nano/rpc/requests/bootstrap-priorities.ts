import { z } from "zod";

export function BootstrapPrioritiesRequest() {
  return z.object({
    action: z.literal("bootstrap_priorities"),
  });
}

export type BootstrapPrioritiesRequest = z.infer<ReturnType<typeof BootstrapPrioritiesRequest>>;
