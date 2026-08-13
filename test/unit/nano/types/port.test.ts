import { Port, PortBounds, PortString } from "../../../../src/nano/types/port";
import { assert } from "../../../assert";

describe("Port schema", () => {
  test("validates ports within allowed bounds", () => {
    const validPorts = [0, 1, 8080, PortBounds.max()];
    for (const validPort of validPorts) {
      expect(Port().parse(validPort)).toBe(validPort);
    }
  });

  test("rejects ports outside allowed bounds", () => {
    assert(!Port().safeParse(PortBounds.min() - 1).success);
    assert(!Port().safeParse(PortBounds.max() + 1).success);
  });

  test("rejects non-integer ports", () => {
    assert(!Port().safeParse(8080.5).success);
    assert(!Port().safeParse("8080").success);
  });
});

describe("PortString schema", () => {
  test("validates string ports within allowed bounds", () => {
    const validPorts = [String(PortBounds.min()), "1", "8080", String(PortBounds.max())];
    for (const validPort of validPorts) {
      expect(PortString().parse(validPort)).toBe(validPort);
    }
  });

  test("rejects string ports outside allowed bounds", () => {
    assert(!PortString().safeParse(String(PortBounds.max() + 1)).success);
    assert(!PortString().safeParse(String(-1)).success);
  });

  test("rejects non-numeric port strings", () => {
    assert(!PortString().safeParse("eighty").success);
    assert(!PortString().safeParse("8080.5").success);
  });
});
