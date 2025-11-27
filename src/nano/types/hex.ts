import { z } from "zod";

export type HexString = z.infer<ReturnType<typeof HexString>>;
export const HexString = () => z.string().regex(/^[0-9a-fA-F]+$/);
