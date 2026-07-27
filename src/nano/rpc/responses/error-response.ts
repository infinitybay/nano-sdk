import { z } from "zod";

export type ErrorResponse = z.infer<ReturnType<typeof ErrorResponse>>;
export const ErrorResponse = () =>
  z.object({
    error: z.string(),
  });
