import { z } from "zod";

export type SubtypeOpenString = z.infer<ReturnType<typeof SubtypeOpenString>>;
export const SubtypeOpenString = () => z.literal("open");

export type SubtypeUnknownString = z.infer<ReturnType<typeof SubtypeUnknownString>>;
export const SubtypeUnknownString = () => z.literal("unknown");

export type SubtypeString = z.infer<ReturnType<typeof SubtypeString>>;
export const SubtypeString = () =>
  z.union([z.literal("change"), z.literal("epoch"), z.literal("receive"), z.literal("send")]);
