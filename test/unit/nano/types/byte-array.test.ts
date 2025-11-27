import { ByteArray } from "../../../../src/nano/types/byte-array";

describe("ByteArray schema", () => {
  test("validates parsing of Uint8Array instances", () => {
    const byteArray: Uint8Array = new Uint8Array([1, 2, 3, 4]);
    expect(ByteArray().parse(byteArray)).toBe(byteArray);
  });
});
