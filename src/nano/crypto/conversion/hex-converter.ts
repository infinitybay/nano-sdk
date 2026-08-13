import { ByteArray } from "../../types/byte-array";
import { HexString } from "../../types/hex";
import { NonThrowing } from "../../types/non-throwing";
import { Result } from "../../types/result";
import { Throwing } from "../../types/throwing";
import { CryptoError } from "../crypto-error";
import { CryptoErrorCode } from "../crypto-error-code";

export type HexToBytesParams = {
  hex: string;
};

export type HexToBytesResult = Result<
  Uint8Array,
  CryptoError<CryptoErrorCode.InvalidHex | CryptoErrorCode.InvalidHexLength | CryptoErrorCode.Unexpected>
>;

export function hexToBytes(params: HexToBytesParams & NonThrowing): HexToBytesResult;
export function hexToBytes(params: HexToBytesParams & Throwing): Uint8Array;
export function hexToBytes(params: HexToBytesParams & (Throwing | NonThrowing)): Uint8Array | HexToBytesResult;
export function hexToBytes(params: HexToBytesParams & (Throwing | NonThrowing)) {
  const result = ((): HexToBytesResult => {
    try {
      const validatedHex = HexString().safeParse(params.hex);
      if (!validatedHex.success) {
        return Result.err(new CryptoError(CryptoErrorCode.InvalidHex, "Invalid hex string."));
      }

      const normalizedHex = validatedHex.data.toUpperCase();
      if (normalizedHex.length % 2 !== 0) {
        return Result.err(
          new CryptoError(
            CryptoErrorCode.InvalidHexLength,
            `Hex value [${normalizedHex}] must contain a multiple of 2 characters.`
          )
        );
      }

      const byteValues: number[] = [];
      for (let index = 0; index < normalizedHex.length; index += 2) {
        byteValues.push(parseInt(normalizedHex.substring(index, index + 2), 16));
      }

      return Result.ok(new Uint8Array(byteValues));
    } catch (e) {
      return Result.err(new CryptoError(CryptoErrorCode.Unexpected, "Unexpected error.", { cause: e }));
    }
  })();

  return Result.unwrap(result, params.throwOnError);
}

export type BytesToHexParams = {
  bytes: Uint8Array;
};

export type BytesToHexResult = Result<
  HexString,
  CryptoError<CryptoErrorCode.InvalidBytes | CryptoErrorCode.InvalidHex | CryptoErrorCode.Unexpected>
>;

export function bytesToHex(params: BytesToHexParams & NonThrowing): BytesToHexResult;
export function bytesToHex(params: BytesToHexParams & Throwing): HexString;
export function bytesToHex(params: BytesToHexParams & (Throwing | NonThrowing)): HexString | BytesToHexResult;
export function bytesToHex(params: BytesToHexParams & (Throwing | NonThrowing)) {
  const result = ((): BytesToHexResult => {
    try {
      const validatedBytes = ByteArray().safeParse(params.bytes);
      if (!validatedBytes.success) {
        return Result.err(new CryptoError(CryptoErrorCode.InvalidBytes, "Invalid bytes value."));
      }

      let hexString: string = "";
      for (let index = 0; index < validatedBytes.data.length; index++) {
        let byteHex = (validatedBytes.data[index] & 0xff).toString(16);
        byteHex = byteHex.length === 1 ? `0${byteHex}` : byteHex;
        hexString += byteHex;
      }

      const hexResult = HexString().safeParse(hexString.toUpperCase());
      if (!hexResult.success) {
        return Result.err(new CryptoError(CryptoErrorCode.InvalidHex, "Invalid hex value derived from byte array."));
      }

      return Result.ok(hexResult.data);
    } catch (e) {
      return Result.err(new CryptoError(CryptoErrorCode.Unexpected, "Unexpected error.", { cause: e }));
    }
  })();

  return Result.unwrap(result, params.throwOnError);
}
