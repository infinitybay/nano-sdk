import z from "zod";

import { TimestampString } from "../../types/timestamp";

export function UptimeResponse() {
  return z.object({
    seconds: TimestampString(),
  });
}

export type UptimeResponse = z.infer<ReturnType<typeof UptimeResponse>>;
