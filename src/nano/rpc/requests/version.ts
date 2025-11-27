import { z } from "zod";

export function VersionRequest() {
  return z.object({
    action: z.literal("version"),
  });
}

export type VersionRequest = z.infer<ReturnType<typeof VersionRequest>>;
