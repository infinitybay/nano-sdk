import { z } from "zod";

import { HexString } from "./hex";

export type HashString = z.infer<ReturnType<typeof HashString>>;
export const HashString = () => HexString().length(64);

export const HashStrings = {
  zero: (): HashString => HashString().parse("0000000000000000000000000000000000000000000000000000000000000000"),
};
