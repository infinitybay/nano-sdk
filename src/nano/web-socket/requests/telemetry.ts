import { z } from "zod";

import { Action } from "../types/action";
import { AckRequest } from "./ack";

export type TelemetryRequest = z.infer<ReturnType<typeof TelemetryRequest>>;
export const TelemetryRequest = () =>
  AckRequest().extend({
    action: Action(),
    topic: z.literal("telemetry"),
  });
