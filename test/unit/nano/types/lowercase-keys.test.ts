import { LowercaseKeys } from "../../../../src/nano/types/lowercase-keys";

type Sample = { Foo: number; BAR: string };

describe("LowercaseKeys utility", () => {
  test("transforms object keys to lowercase", () => {
    const value: LowercaseKeys<Sample> = { foo: 1, bar: "abc" } as LowercaseKeys<Sample>;
    expect(value.foo).toBe(1);
    expect(value.bar).toBe("abc");
  });
});
