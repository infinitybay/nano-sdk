import { z } from "zod";

import { EndpointString } from "../../types/endpoint";
import { Port, PortString } from "../../types/port";

export function KeepaliveRequest() {
  return z.object({
    action: z.literal("keepalive"),
    address: EndpointString(),
    port: PortString().or(Port()),
  });
}

export type KeepaliveRequest = z.infer<ReturnType<typeof KeepaliveRequest>>;
