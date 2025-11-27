import { UppercaseKeys } from "../../../../src/nano/types/uppercase-keys";

type Sample = { foo: number; barBaz: string };

describe("UppercaseKeys utility", () => {
  test("transforms object keys to uppercase", () => {
    const value: UppercaseKeys<Sample> = { FOO: 1, BARBAZ: "abc" } as UppercaseKeys<Sample>;
    expect(value.FOO).toBe(1);
    expect(value.BARBAZ).toBe("abc");
  });
});
