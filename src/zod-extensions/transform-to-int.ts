import { z } from "zod";

import { Int } from "../nano/types/int";

declare module "zod" {
  interface ZodString {
    transformToInt(): z.ZodType<number>;
  }
}

z.ZodString.prototype.transformToInt = function () {
  return this.transform((val: string): number => {
    const parsed = Int().safeParse(Number(val));
    if (!parsed.success) {
      throw new Error("Invalid integer");
    }
    return parsed.data;
  });
};
