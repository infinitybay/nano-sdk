import z from "zod";

export function ReceivableExistsResponse() {
  return z.object({
    exists: z.union([z.literal("0"), z.literal("1")]),
  });
}

export type ReceivableExistsResponse = z.infer<ReturnType<typeof ReceivableExistsResponse>>;
