import { z } from "zod";

import { BooleanString } from "../../types/boolean";
import { EndpointString } from "../../types/endpoint";
import { Port, PortString } from "../../types/port";

const BaseTelemetryRequest = {
  action: z.literal("telemetry"),
  raw: BooleanString().or(z.boolean()).optional(),
};

export function TelemetryRequest() {
  return z.union([
    z.object({
      ...BaseTelemetryRequest,
      address: EndpointString(),
      port: PortString().or(Port()),
    }),
    z.object({
      ...BaseTelemetryRequest,
      address: z.never().optional(),
      port: z.never().optional(),
    }),
  ]);
}

export type TelemetryRequest = z.infer<ReturnType<typeof TelemetryRequest>>;
