import { ByteArray } from "../../types/byte-array";
import { HexString } from "../../types/hex";
import { NonThrowing } from "../../types/non-throwing";
import { Result } from "../../types/result";
import { Throwing } from "../../types/throwing";

type HexToBytesParams = {
  hex: string;
} & (Throwing | NonThrowing);

function hexToBytesThrowing(params: HexToBytesParams & Throwing): Uint8Array {
  const validatedHex = HexString().safeParse(params.hex);
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

function hexToBytesNonThrowing(params: HexToBytesParams & NonThrowing): Result<Uint8Array> {
  try {
    return {
      success: true,
      data: hexToBytesThrowing({ ...params, throwOnError: true }),
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e : new Error("Unexpected error."),
    };
  }
}

export function hexToBytes(params: HexToBytesParams & NonThrowing): Result<Uint8Array>;
export function hexToBytes(params: HexToBytesParams & Throwing): Uint8Array;
export function hexToBytes(params: HexToBytesParams): Uint8Array | Result<Uint8Array>;
export function hexToBytes(params: HexToBytesParams) {
  if (params.throwOnError === false) {
    return hexToBytesNonThrowing({ ...params, throwOnError: false });
  } else {
    return hexToBytesThrowing({ ...params, throwOnError: true });
  }
}

type BytesToHexParams = {
  bytes: Uint8Array;
} & (Throwing | NonThrowing);

function bytesToHexThrowing(params: BytesToHexParams & Throwing): HexString {
  const validatedBytes = ByteArray().safeParse(params.bytes);
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

function bytesToHexNonThrowing(params: BytesToHexParams & NonThrowing): Result<HexString> {
  try {
    return {
      success: true,
      data: bytesToHexThrowing({ ...params, throwOnError: true }),
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e : new Error("Unexpected error."),
    };
  }
}

export function bytesToHex(params: BytesToHexParams & NonThrowing): Result<HexString>;
export function bytesToHex(params: BytesToHexParams & Throwing): HexString;
export function bytesToHex(params: BytesToHexParams): HexString | Result<HexString>;
export function bytesToHex(params: BytesToHexParams) {
  if (params.throwOnError === false) {
    return bytesToHexNonThrowing({ ...params, throwOnError: false });
  } else {
    return bytesToHexThrowing({ ...params, throwOnError: true });
  }
}
