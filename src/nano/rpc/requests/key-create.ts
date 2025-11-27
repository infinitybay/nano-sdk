import { z } from "zod";

export function KeyCreateRequest() {
  return z.object({
    action: z.literal("key_create"),
  });
}

export type KeyCreateRequest = z.infer<ReturnType<typeof KeyCreateRequest>>;
