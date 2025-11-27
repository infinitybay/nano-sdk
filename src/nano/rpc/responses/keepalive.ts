import { z } from "zod";

export function KeepaliveResponse() {
  return z.object({
    started: z.literal("1"),
  });
}

export type KeepaliveResponse = z.infer<ReturnType<typeof KeepaliveResponse>>;
