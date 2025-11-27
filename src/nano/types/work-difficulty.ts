import { z } from "zod";

import { HexString } from "./hex";

export type WorkDifficultyString = z.infer<ReturnType<typeof WorkDifficultyString>>;
export const WorkDifficultyString = () => HexString().length(16);
