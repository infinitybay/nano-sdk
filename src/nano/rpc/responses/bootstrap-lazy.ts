import { z } from "zod";

export function BootstrapLazyResponse() {
  return z.object({});
}

export type BootstrapLazyResponse = z.infer<ReturnType<typeof BootstrapLazyResponse>>;
