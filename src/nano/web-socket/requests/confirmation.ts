import { z } from "zod";

import { AccountString } from "../../types/account";
import { BooleanString } from "../../types/boolean";
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
        all_local_accounts: BooleanString().or(z.boolean()).optional(),
        confirmation_type: ConfirmationType().optional(),
        include_block: BooleanString().or(z.boolean()).optional(),
        include_election_info: BooleanString().or(z.boolean()).optional(),
        include_election_info_with_votes: BooleanString().or(z.boolean()).optional(),
        include_linked_account: BooleanString().or(z.boolean()).optional(),
        include_sideband_info: BooleanString().or(z.boolean()).optional(),
      })
      .optional(),
  });
