import { z } from "zod";

import { HexString } from "./hex";

export type PrivateKeyString = z.infer<ReturnType<typeof PrivateKeyString>>;
export const PrivateKeyString = () => HexString().length(64);

export const PrivateKeyStrings = {
  zero: (): PrivateKeyString =>
    PrivateKeyString().parse("0000000000000000000000000000000000000000000000000000000000000000"),
};
