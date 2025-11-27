import { z } from "zod";

export const PortBounds = {
  min: () => 0,
  max: () => 65535,
};

export type Port = z.infer<ReturnType<typeof Port>>;
export const Port = () => z.int().min(PortBounds.min()).max(PortBounds.max());

export type PortString = z.infer<ReturnType<typeof PortString>>;
export const PortString = () =>
  z
    .string()
    .regex(/^(0|[1-9]\d*)$/, "Invalid port")
    .refine((val) => Port().safeParse(Number(val)).success, {
      message: "Invalid port",
    });
