import * as Nano from "../../../src/nano";

describe("Nano namespace exports", () => {
  test("exposes grouped Nano namespaces", () => {
    expect(Nano.Blocks).toBeDefined();
    expect(Nano.Crypto).toBeDefined();
    expect(Nano.RPC).toBeDefined();
    expect(Nano.Types).toBeDefined();
    expect(Nano.WebSocket).toBeDefined();
  });
});
