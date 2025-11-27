import { z } from "zod";

export function BootstrapResponse() {
  return z.object({});
}

export type BootstrapResponse = z.infer<ReturnType<typeof BootstrapResponse>>;
