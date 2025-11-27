import { Nano } from "../../src";

describe("Nano index exports", () => {
  test("exposes Nano namespace exports", () => {
    expect(Nano).toBeDefined();
    expect(Nano.Types).toBeDefined();
    expect(Nano.Crypto).toBeDefined();
  });
});
