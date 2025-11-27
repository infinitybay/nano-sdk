import { z } from "zod";

import { BooleanString } from "../../types/boolean";
import { EndpointString } from "../../types/endpoint";
import { Port, PortString } from "../../types/port";

export function TelemetryRequest() {
  return z.object({
    action: z.literal("telemetry"),
    address: EndpointString().optional(),
    port: PortString().or(Port()).optional(),
    raw: BooleanString().or(z.boolean()).optional(),
  });
}

export type TelemetryRequest = z.infer<ReturnType<typeof TelemetryRequest>>;
