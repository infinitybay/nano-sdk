import { z } from "zod";

import { TimestampString } from "../../types/timestamp";
import { UIntString } from "../../types/uint";

export type BootstrapMessage = z.infer<ReturnType<typeof BootstrapMessage>>;
export const BootstrapMessage = () =>
  z.union([
    z.object({
      reason: z.literal("started"),
      id: z.string(),
      mode: z.string(),
    }),
    z.object({
      reason: z.literal("exited"),
      id: z.string(),
      mode: z.string(),
      total_blocks: UIntString(),
      duration: TimestampString(),
    }),
  ]);

export type BootstrapResponse = z.infer<ReturnType<typeof BootstrapResponse>>;
export const BootstrapResponse = () =>
  z.object({
    topic: z.literal("bootstrap"),
    time: TimestampString(),
    message: BootstrapMessage(),
  });
