import { z } from "zod";

import { AccountString } from "../../types/account";
import { PrivateKeyString } from "../../types/private-key";
import { PublicKeyString } from "../../types/public-key";

export function KeyCreateResponse() {
  return z.object({
    private: PrivateKeyString(),
    public: PublicKeyString(),
    account: AccountString(),
  });
}

export type KeyCreateResponse = z.infer<ReturnType<typeof KeyCreateResponse>>;
