import { z } from "zod";

import { EndpointString } from "../../types/endpoint";
import { Port, PortString } from "../../types/port";

export function WorkPeerAddRequest() {
  return z.object({
    action: z.literal("work_peer_add"),
    address: EndpointString(),
    port: PortString().or(Port()),
  });
}

export type WorkPeerAddRequest = z.infer<ReturnType<typeof WorkPeerAddRequest>>;
