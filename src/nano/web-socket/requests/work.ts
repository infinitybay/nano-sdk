import { z } from "zod";

import { Action } from "../types/action";
import { AckRequest } from "./ack";

export type WorkRequest = z.infer<ReturnType<typeof WorkRequest>>;
export const WorkRequest = () =>
  AckRequest().extend({
    action: Action(),
    topic: z.literal("work"),
  });
