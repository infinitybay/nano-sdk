import { z } from "zod";

export type LegacyChangeTypeString = z.infer<ReturnType<typeof LegacyChangeTypeString>>;
export const LegacyChangeTypeString = () => z.literal("change");

export type LegacyOpenTypeString = z.infer<ReturnType<typeof LegacyOpenTypeString>>;
export const LegacyOpenTypeString = () => z.literal("open");

export type LegacyReceiveTypeString = z.infer<ReturnType<typeof LegacyReceiveTypeString>>;
export const LegacyReceiveTypeString = () => z.literal("receive");

export type LegacySendTypeString = z.infer<ReturnType<typeof LegacySendTypeString>>;
export const LegacySendTypeString = () => z.literal("send");

export type StateTypeString = z.infer<ReturnType<typeof StateTypeString>>;
export const StateTypeString = () => z.literal("state");

export type TypeString = z.infer<ReturnType<typeof TypeString>>;
export const TypeString = () =>
  LegacyChangeTypeString()
    .or(LegacyOpenTypeString())
    .or(LegacyReceiveTypeString())
    .or(LegacySendTypeString())
    .or(StateTypeString());
