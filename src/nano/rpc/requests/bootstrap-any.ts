import { z } from "zod";

import { BooleanString } from "../../types/boolean";

export function BootstrapAnyRequest() {
  return z.object({
    action: z.literal("bootstrap_any"),
    force: BooleanString().or(z.boolean()).optional(),
  });
}

export type BootstrapAnyRequest = z.infer<ReturnType<typeof BootstrapAnyRequest>>;
