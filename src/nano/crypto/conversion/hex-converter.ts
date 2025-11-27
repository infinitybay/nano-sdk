import { ByteArray } from "../../types/byte-array";
import { HexString } from "../../types/hex";
import { Result } from "../../types/result";

export function hexToBytes(hex: string): Uint8Array {
  const validatedHex = HexString().safeParse(hex);
  if (!validatedHex.success) {
    throw new Error("Invalid hex string.");
  }

  const normalizedHex = validatedHex.data.toUpperCase();
  if (normalizedHex.length % 2 !== 0) {
    throw new Error(`Hex value [${normalizedHex}] must contain a multiple of 2 characters.`);
  }

  const byteValues: number[] = [];
  for (let index = 0; index < normalizedHex.length; index += 2) {
    byteValues.push(parseInt(normalizedHex.substring(index, index + 2), 16));
  }

  return new Uint8Array(byteValues);
}

export function safeHexToBytes(hex: string): Result<Uint8Array> {
  try {
    return { success: true, data: hexToBytes(hex) };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err : new Error("Unexpected error.") };
  }
}

export function bytesToHex(bytes: Uint8Array): HexString {
  const validatedBytes = ByteArray().safeParse(bytes);
  if (!validatedBytes.success) {
    throw new Error("Invalid bytes value.");
  }

  let hexString: string = "";
  for (let index = 0; index < validatedBytes.data.length; index++) {
    let byteHex = (validatedBytes.data[index] & 0xff).toString(16);
    byteHex = byteHex.length === 1 ? `0${byteHex}` : byteHex;
    hexString += byteHex;
  }

  const hexResult = HexString().safeParse(hexString.toUpperCase());
  if (!hexResult.success) {
    throw new Error("Invalid hex value derived from byte array.");
  }

  return hexResult.data;
}

export function safeBytesToHex(bytes: Uint8Array): Result<HexString> {
  try {
    return { success: true, data: bytesToHex(bytes) };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err : new Error("Unexpected error.") };
  }
}
