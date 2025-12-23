import { z } from "zod";

import { Action } from "../types/action";
import { AckRequest } from "./ack";

export type BootstrapRequest = z.infer<ReturnType<typeof BootstrapRequest>>;
export const BootstrapRequest = () =>
  AckRequest().extend({
    action: Action(),
    topic: z.literal("bootstrap"),
  });
