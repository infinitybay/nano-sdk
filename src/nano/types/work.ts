import { z } from "zod";

import { HexString } from "./hex";

export type WorkString = z.infer<ReturnType<typeof WorkString>>;
export const WorkString = () => HexString().length(16);

export const WorkStrings = {
  zero: (): WorkString => WorkString().parse("0000000000000000"),
};
