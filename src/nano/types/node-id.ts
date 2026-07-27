import { z } from "zod";

import { AccountString } from "./account";

export type NodeIdString = z.infer<ReturnType<typeof NodeIdString>>;
export const NodeIdString = () => AccountString({ prefix: "node_" });
