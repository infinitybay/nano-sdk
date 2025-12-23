import { z } from "zod";

import { Action } from "./action";

export type Ack = z.infer<ReturnType<typeof Ack>>;
export const Ack = () => Action().or(z.literal("pong"));
