import { z } from "zod";

import { BooleanString } from "../../types/boolean";

export function BootstrapLazyRequest() {
  return z.object({
    action: z.literal("bootstrap_lazy"),
    force: BooleanString().or(z.boolean()).optional(),
  });
}

export type BootstrapLazyRequest = z.infer<ReturnType<typeof BootstrapLazyRequest>>;
