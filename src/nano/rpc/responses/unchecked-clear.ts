import { z } from "zod";

export function UncheckedClearResponse() {
  return z.object({
    success: z.literal(""),
  });
}

export type UncheckedClearResponse = z.infer<ReturnType<typeof UncheckedClearResponse>>;
