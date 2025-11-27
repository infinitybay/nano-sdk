import { z } from "zod";

export function BlockConfirmResponse() {
  return z.object({
    started: z.literal("1"),
  });
}

export type BlockConfirmResponse = z.infer<ReturnType<typeof BlockConfirmResponse>>;
