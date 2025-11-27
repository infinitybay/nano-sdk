import { z } from "zod";

import { LegacyChangeBlock } from "../../blocks/legacy-change-block";
import { LegacyOpenBlock } from "../../blocks/legacy-open-block";
import { LegacyReceiveBlock } from "../../blocks/legacy-receive-block";
import { LegacySendBlock } from "../../blocks/legacy-send-block";
import { StateBlock } from "../../blocks/state-block";
import { AccountString } from "../../types/account";
import { RawAmountString } from "../../types/amount";
import { HashString } from "../../types/hash";
import { HeightString } from "../../types/height";
import { SubtypeString } from "../../types/subtype";
import { TimestampString } from "../../types/timestamp";

export type ConfirmationResponseBlockContent = z.infer<ReturnType<typeof ConfirmationResponseBlockContent>>;
export const ConfirmationResponseBlockContent = () =>
  z.union([
    StateBlock().extend({ linked_account: AccountString().optional(), subtype: SubtypeString().optional() }),
    LegacyChangeBlock().extend({ linked_account: AccountString().optional() }),
    LegacyOpenBlock().extend({ linked_account: AccountString().optional() }),
    LegacyReceiveBlock().extend({ linked_account: AccountString().optional() }),
    LegacySendBlock().extend({ linked_account: AccountString().optional() }),
  ]);

export type ConfirmationResponse = z.infer<ReturnType<typeof ConfirmationResponse>>;
export const ConfirmationResponse = () =>
  z.object({
    topic: z.literal("confirmation"),
    time: TimestampString(),
    message: z.object({
      account: AccountString(),
      amount: RawAmountString(),
      hash: HashString(),
      confirmation_type: z.union([
        z.literal("active_confirmation_height"),
        z.literal("active_quorum"),
        z.literal("inactive"),
        z.literal("unknown"),
      ]),
      block: ConfirmationResponseBlockContent().optional(),
      election_info: z
        .object({
          duration: TimestampString(),
          time: TimestampString(),
          tally: RawAmountString(),
          final: RawAmountString(),
          blocks: z.string(),
          voters: z.string(),
          request_count: z.string(),
          votes: z
            .object({
              representative: AccountString(),
              timestamp: TimestampString(),
              hash: HashString(),
              weight: RawAmountString(),
            })
            .array()
            .optional(),
        })
        .optional(),
      sideband: z
        .object({
          height: HeightString(),
          local_timestamp: TimestampString(),
        })
        .optional(),
    }),
  });
