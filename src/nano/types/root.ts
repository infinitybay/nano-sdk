import { z } from "zod";

import { HexString } from "./hex";

export type RootString = z.infer<ReturnType<typeof RootString>>;
export const RootString = () => HexString().length(128);

export const RootStrings = {
  zero: (): RootString =>
    RootString().parse(
      "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
    ),
};
