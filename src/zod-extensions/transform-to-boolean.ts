import { z } from "zod";

declare module "zod" {
  interface ZodString {
    transformToBoolean(): z.ZodType<boolean>;
  }
}

z.ZodString.prototype.transformToBoolean = function () {
  return this.transform((val: string): boolean => {
    if (!val) return false;
    if (val.toLowerCase() === "true") return true;
    const valAsNumber = Number(val);
    return Number.isFinite(valAsNumber) && valAsNumber !== 0;
  });
};
