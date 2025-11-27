import z from "zod";

export type NumberString = z.infer<ReturnType<typeof NumberString>>;
export const NumberString = () =>
  z.string().refine(
    (val) => {
      if (val === "") return false;
      if (val.trim() !== val) return false;
      const n = Number(val);
      return Number.isFinite(n);
    },
    {
      message: "Invalid number",
    }
  );
