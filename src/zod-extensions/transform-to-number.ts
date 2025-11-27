import { z } from "zod";

declare module "zod" {
  interface ZodString {
    transformToNumber(): z.ZodType<number>;
  }
}

z.ZodString.prototype.transformToNumber = function () {
  return this.transform((val: string): number => {
    const parsed = z.number().safeParse(Number(val));
    if (!parsed.success) {
      throw new Error("Invalid number");
    }
    return parsed.data;
  });
};
