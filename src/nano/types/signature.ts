import { z } from "zod";

import { HexString } from "./hex";

export type SignatureString = z.infer<ReturnType<typeof SignatureString>>;
export const SignatureString = () => HexString().length(128);

export const SignatureStrings = {
  zero: (): SignatureString =>
    SignatureString().parse(
      "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
    ),
};
