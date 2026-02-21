import { z } from "zod";

import { PortString } from "./port";

const hostnameSegment = "[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?";
const hostnamePattern = new RegExp(`^(?:${hostnameSegment}\\.)*${hostnameSegment}$`);

const isInvalidNumericDotted = (host: string) => {
  const parts = host.split(".");
  const numericParts = parts.filter((p) => /^\d+$/.test(p));
  return numericParts.length > 1;
};

const hasValidPort = (port?: string) => (port === undefined ? true : PortString().safeParse(port).success);

const isIPv4 = (input: string): boolean => {
  const parts = input.split(".");
  if (parts.length !== 4) return false;

  for (const part of parts) {
    if (!/^\d+$/.test(part)) return false;
    const num = Number(part);
    if (num < 0 || num > 255) return false;
    if (part.length > 1 && part.startsWith("0")) return false; // no leading zeros
  }

  return true;
};

const isIPv6 = (input: string): boolean => {
  if (input.includes(".")) {
    const lastColon = input.lastIndexOf(":");
    if (lastColon === -1) return false;
    const ipv4Part = input.slice(lastColon + 1);
    if (!isIPv4(ipv4Part)) return false;
    input = input.slice(0, lastColon) + ":0:0"; // normalize for validation
  }

  const parts = input.split("::");

  if (parts.length > 2) return false;

  const head = parts[0] ? parts[0].split(":") : [];
  const tail = parts[1] ? parts[1].split(":") : [];

  if (parts.length === 1) {
    if (head.length !== 8) return false;
  } else {
    if (head.length + tail.length >= 8) return false;
  }

  const validHex = /^[0-9a-fA-F]{1,4}$/;

  for (const part of [...head, ...tail]) {
    if (!validHex.test(part)) return false;
  }

  return true;
};

const isIP = (input: string): 0 | 4 | 6 => {
  if (isIPv4(input)) return 4;
  if (isIPv6(input)) return 6;
  return 0;
};

const isValidHostname = (host: string) => hostnamePattern.test(host);

const isValidEndpoint = (val: string) => {
  // 1) Pure IP
  if (isIP(val) !== 0) {
    return true;
  }

  // 2) IPv6 bracket format: [::1]:7076
  const bracketMatch = val.match(/^\[(.*)\](?::(\d+))?$/);
  if (bracketMatch) {
    return isIP(bracketMatch[1]) === 6 && hasValidPort(bracketMatch[2]);
  }

  // 3) Host:Port
  const lastColonIndex = val.lastIndexOf(":");
  if (lastColonIndex !== -1) {
    const possiblePort = val.slice(lastColonIndex + 1);
    if (/^\d+$/.test(possiblePort)) {
      const hostPart = val.slice(0, lastColonIndex);
      if (!hostPart) {
        return false;
      }
      if (isIP(hostPart) !== 0) {
        return hasValidPort(possiblePort);
      }
      if (isInvalidNumericDotted(hostPart)) {
        return false;
      }
      if (isValidHostname(hostPart)) {
        return hasValidPort(possiblePort);
      }
      return false;
    }
  }

  // 4) Reject 256.256.256.256, 255.255.255, 128.128, etc.
  if (isInvalidNumericDotted(val)) {
    return false;
  }

  return isValidHostname(val);
};

export type EndpointString = z.infer<ReturnType<typeof EndpointString>>;
export const EndpointString = () => z.string().refine((val) => isValidEndpoint(val), { message: "Invalid endpoint" });
