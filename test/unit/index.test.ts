import { Nano } from "../../src";

describe("Nano index exports", () => {
  test("exposes Nano namespace exports", () => {
    expect(Nano).toBeDefined();
    expect(Nano.Blocks).toBeDefined();
    expect(Nano.Crypto).toBeDefined();
    expect(Nano.Math).toBeDefined();
    expect(Nano.RPC).toBeDefined();
    expect(Nano.Types).toBeDefined();
    expect(Nano.WebSocket).toBeDefined();
    expect(Nano.WebSocketClient).toBeDefined();
  });
});
