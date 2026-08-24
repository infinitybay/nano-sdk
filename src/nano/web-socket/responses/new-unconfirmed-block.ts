import { z } from "zod";

import { LegacyChangeBlock } from "../../blocks/legacy-change-block";
import { LegacyOpenBlock } from "../../blocks/legacy-open-block";
import { LegacyReceiveBlock } from "../../blocks/legacy-receive-block";
import { LegacySendBlock } from "../../blocks/legacy-send-block";
import { StateBlock } from "../../blocks/state-block";
import { HashString } from "../../types/hash";
import { SubtypeString } from "../../types/subtype";
import { TimestampString } from "../../types/timestamp";

export type NewUnconfirmedBlockSubtype = z.infer<ReturnType<typeof NewUnconfirmedBlockSubtype>>;
export const NewUnconfirmedBlockSubtype = SubtypeString;

export type NewUnconfirmedBlockMessage = z.infer<ReturnType<typeof NewUnconfirmedBlockMessage>>;
export const NewUnconfirmedBlockMessage = () =>
  z.union([
    LegacyChangeBlock(),
    LegacyOpenBlock(),
    LegacyReceiveBlock(),
    LegacySendBlock(),
    StateBlock().extend({
      subtype: NewUnconfirmedBlockSubtype(),
    }),
  ]);

export type NewUnconfirmedBlockResponse = z.infer<ReturnType<typeof NewUnconfirmedBlockResponse>>;
export const NewUnconfirmedBlockResponse = () =>
  z.object({
    topic: z.literal("new_unconfirmed_block"),
    time: TimestampString(),
    hash: HashString(),
    message: NewUnconfirmedBlockMessage(),
  });
