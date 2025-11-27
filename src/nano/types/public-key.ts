import { z } from "zod";

import { HexString } from "./hex";

export type PublicKeyString = z.infer<ReturnType<typeof PublicKeyString>>;
export const PublicKeyString = () => HexString().length(64);

export const PublicKeyStrings = {
  zero: (): PublicKeyString =>
    PublicKeyString().parse("0000000000000000000000000000000000000000000000000000000000000000"),
};
