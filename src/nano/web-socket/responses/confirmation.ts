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
import { UIntString } from "../../types/uint";

export type ConfirmationMessageBlock = z.infer<ReturnType<typeof ConfirmationMessageBlock>>;
export const ConfirmationMessageBlock = () =>
  z.union([
    StateBlock().extend({
      linked_account: AccountString().or(z.literal("")).optional(),
      subtype: SubtypeString().optional(),
    }),
    LegacyChangeBlock().extend({ linked_account: AccountString().or(z.literal("")).optional() }),
    LegacyOpenBlock().extend({ linked_account: AccountString().or(z.literal("")).optional() }),
    LegacyReceiveBlock().extend({ linked_account: AccountString().or(z.literal("")).optional() }),
    LegacySendBlock().extend({ linked_account: AccountString().or(z.literal("")).optional() }),
  ]);

export type ConfirmationMessageElectionInfo = z.infer<ReturnType<typeof ConfirmationMessageElectionInfo>>;
export const ConfirmationMessageElectionInfo = () =>
  z.object({
    duration: TimestampString(),
    time: TimestampString(),
    tally: RawAmountString(),
    final: RawAmountString(),
    blocks: UIntString(),
    voters: UIntString(),
    request_count: UIntString(),
    votes: z
      .object({
        representative: AccountString(),
        timestamp: TimestampString(),
        hash: HashString(),
        weight: RawAmountString(),
      })
      .array()
      .optional(),
  });

export type ConfirmationMessageSideband = z.infer<ReturnType<typeof ConfirmationMessageSideband>>;
export const ConfirmationMessageSideband = () =>
  z.object({
    height: HeightString(),
    local_timestamp: TimestampString(),
  });

export type ConfirmationMessage = z.infer<ReturnType<typeof ConfirmationMessage>>;
export const ConfirmationMessage = () =>
  z.object({
    account: AccountString(),
    amount: RawAmountString(),
    hash: HashString(),
    confirmation_type: z.union([
      z.literal("active_confirmation_height"),
      z.literal("active_quorum"),
      z.literal("inactive"),
      z.literal("unknown"),
    ]),
    block: ConfirmationMessageBlock().optional(),
    election_info: ConfirmationMessageElectionInfo().optional(),
    sideband: ConfirmationMessageSideband().optional(),
  });

export type ConfirmationResponse = z.infer<ReturnType<typeof ConfirmationResponse>>;
export const ConfirmationResponse = () =>
  z.object({
    topic: z.literal("confirmation"),
    time: TimestampString(),
    message: ConfirmationMessage(),
  });
