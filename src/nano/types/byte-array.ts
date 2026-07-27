import { z } from "zod";

export type ByteArray = z.infer<ReturnType<typeof ByteArray>>;
export const ByteArray = () => z.instanceof(Uint8Array);
