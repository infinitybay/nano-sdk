import { AssertionError } from "assert";

// Credits: https://stackoverflow.com/a/71617709
type Assert = (condition: unknown, message?: string) => asserts condition;
export const assert: Assert = (condition: unknown, msg?: string): asserts condition => {
  if (!condition) {
    throw new AssertionError({ message: msg });
  }
};
