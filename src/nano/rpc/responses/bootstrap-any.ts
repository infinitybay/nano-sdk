import { z } from "zod";

export function BootstrapAnyResponse() {
  return z.object({});
}

export type BootstrapAnyResponse = z.infer<ReturnType<typeof BootstrapAnyResponse>>;
