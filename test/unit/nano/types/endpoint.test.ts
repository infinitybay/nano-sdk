import { EndpointString } from "../../../../src/nano/types/endpoint";

describe("EndpointString schema", () => {
  test("validates ipv4, ipv6, and hostnames with optional ports", () => {
    const validEndpoints = [
      "::ffff:177.66.167.199",
      "::ffff:177.66.167.199:7076",
      "127.0.0.1",
      "127.0.0.1:8080",
      "localhost",
      "localhost:7076",
      "[::ffff:3.112.16.241]:55030",
      "2001:db8::1",
      "[2001:db8::1]:443",
      "example.com",
      "example.com:3000",
    ];
    for (const validEndpoint of validEndpoints) {
      expect(EndpointString().parse(validEndpoint)).toBe(validEndpoint);
    }
  });

  test("rejects endpoints with invalid ports", () => {
    expect(EndpointString().safeParse("[::ffff:3.112.16.241]:70000").success).toBe(false);
    expect(EndpointString().safeParse("127.0.0.1:99999").success).toBe(false);
    expect(EndpointString().safeParse("localhost:-1").success).toBe(false);
  });

  test("rejects endpoints with invalid hosts", () => {
    expect(EndpointString().safeParse("256.256.256.256").success).toBe(false);
    expect(EndpointString().safeParse("[::ffff:3.112.16.241").success).toBe(false);
    expect(EndpointString().safeParse("example..com").success).toBe(false);
    expect(EndpointString().safeParse(":8080").success).toBe(false);
  });
});
