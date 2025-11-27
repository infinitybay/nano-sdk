import { z } from "zod";

export function UncheckedClearRequest() {
  return z.object({
    action: z.literal("unchecked_clear"),
  });
}

export type UncheckedClearRequest = z.infer<ReturnType<typeof UncheckedClearRequest>>;
