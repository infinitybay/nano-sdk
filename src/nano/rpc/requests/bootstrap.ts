import { z } from "zod";

import { EndpointString } from "../../types/endpoint";
import { Port, PortString } from "../../types/port";

export function BootstrapRequest() {
  return z.object({
    action: z.literal("bootstrap"),
    address: EndpointString(),
    port: PortString().or(Port()),
  });
}

export type BootstrapRequest = z.infer<ReturnType<typeof BootstrapRequest>>;
