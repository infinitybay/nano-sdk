import { z } from "zod";

import { HexString } from "./hex";

const SeedIndexRange = {
  min: () => 0,
  max: () => 4294967295,
};

export type SeedIndex = z.infer<ReturnType<typeof SeedIndex>>;
export const SeedIndex = () => z.number().int().min(SeedIndexRange.min()).max(SeedIndexRange.max());

export type SeedString = z.infer<ReturnType<typeof SeedString>>;
export const SeedString = () => HexString().length(64);
