import { z } from "zod";

import { UInt } from "../nano/types/uint";

declare module "zod" {
  interface ZodString {
    transformToUInt(): z.ZodType<number>;
  }
}

z.ZodString.prototype.transformToUInt = function () {
  return this.transform((val: string): number => {
    const parsed = UInt().safeParse(Number(val));
    if (!parsed.success) {
      throw new Error("Invalid unsigned integer");
    }
    return parsed.data;
  });
};
