import { z } from "zod";

import { AccountString } from "../../types/account";
import { Action } from "../types/action";
import { ConfirmationType } from "../types/confirmation-type";
import { AckRequest } from "./ack";

export type ConfirmationRequest = z.infer<ReturnType<typeof ConfirmationRequest>>;
export const ConfirmationRequest = () =>
  AckRequest().extend({
    action: Action(),
    topic: z.literal("confirmation"),
    options: z
      .object({
        accounts: AccountString().array().optional(),
        accounts_add: AccountString().array().optional(),
        accounts_del: AccountString().array().optional(),
        all_local_accounts: z.boolean().optional(),
        confirmation_type: ConfirmationType().optional(),
        include_block: z.boolean().optional(),
        include_election_info: z.boolean().optional(),
        include_election_info_with_votes: z.boolean().optional(),
        include_linked_account: z.boolean().optional(),
        include_sideband_info: z.boolean().optional(),
      })
      .optional(),
  });
