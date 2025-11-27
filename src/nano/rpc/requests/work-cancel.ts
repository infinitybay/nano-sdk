import { z } from "zod";

import { HashString } from "../../types/hash";

export function WorkCancelRequest() {
  return z.object({
    action: z.literal("work_cancel"),
    hash: HashString(),
  });
}

export type WorkCancelRequest = z.infer<ReturnType<typeof WorkCancelRequest>>;
