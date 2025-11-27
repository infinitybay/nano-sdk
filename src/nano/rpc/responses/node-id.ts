import { z } from "zod";

import { AccountString } from "../../types/account";
import { NodeIdString } from "../../types/node-id";
import { PublicKeyString } from "../../types/public-key";

export function NodeIdResponse() {
  return z.object({
    public: PublicKeyString(),
    as_account: AccountString(),
    node_id: NodeIdString(),
  });
}

export type NodeIdResponse = z.infer<ReturnType<typeof NodeIdResponse>>;
