import { Port, PortBounds, PortString } from "../../../../src/nano/types/port";

describe("Port schema", () => {
  test("validates ports within allowed bounds", () => {
    const validPorts = [0, 1, 8080, PortBounds.max()];
    for (const validPort of validPorts) {
      expect(Port().parse(validPort)).toBe(validPort);
    }
  });

  test("rejects ports outside allowed bounds", () => {
    expect(Port().safeParse(PortBounds.min() - 1).success).toBe(false);
    expect(Port().safeParse(PortBounds.max() + 1).success).toBe(false);
  });

  test("rejects non-integer ports", () => {
    expect(Port().safeParse(8080.5).success).toBe(false);
    expect(Port().safeParse("8080").success).toBe(false);
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
    expect(PortString().safeParse(String(PortBounds.max() + 1)).success).toBe(false);
    expect(PortString().safeParse(String(-1)).success).toBe(false);
  });

  test("rejects non-numeric port strings", () => {
    expect(PortString().safeParse("eighty").success).toBe(false);
    expect(PortString().safeParse("8080.5").success).toBe(false);
  });
});
