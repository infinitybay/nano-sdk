import { NonThrowing } from "../../types/non-throwing";
import { Result } from "../../types/result";
import { Throwing } from "../../types/throwing";
import { CryptoError } from "../crypto-error";
import { CryptoErrorCode } from "../crypto-error-code";

const alphabet = "13456789abcdefghijkmnopqrstuwxyz";

export type EncodeBase32Params = {
  bytes: Uint8Array;
};

export type EncodeBase32Result = Result<string, CryptoError<CryptoErrorCode.Unexpected>>;

export function encodeBase32(params: EncodeBase32Params & NonThrowing): EncodeBase32Result;
export function encodeBase32(params: EncodeBase32Params & Throwing): string;
export function encodeBase32(params: EncodeBase32Params & (Throwing | NonThrowing)): string | EncodeBase32Result;
export function encodeBase32(params: EncodeBase32Params & (Throwing | NonThrowing)) {
  const result = ((): EncodeBase32Result => {
    try {
      const inputLength = params.bytes.length;
      const totalBits = inputLength * 8;
      const remainingBits = totalBits % 5;
      const paddingBits = remainingBits === 0 ? 0 : 5 - remainingBits;

      let buffer = 0;
      let encoded = "";
      let bufferBits = 0;

      for (let index = 0; index < inputLength; index++) {
        buffer = (buffer << 8) | params.bytes[index];
        bufferBits += 8;

        while (bufferBits >= 5) {
          encoded += alphabet[(buffer >>> (bufferBits + paddingBits - 5)) & 31];
          bufferBits -= 5;
        }
      }

      if (bufferBits > 0) {
        encoded += alphabet[(buffer << (5 - (bufferBits + paddingBits))) & 31];
      }

      return Result.ok(encoded);
    } catch (e) {
      return Result.err(new CryptoError(CryptoErrorCode.Unexpected, "Unexpected error.", { cause: e }));
    }
  })();

  return Result.unwrap(result, params.throwOnError);
}

export type DecodeBase32Params = {
  encoded: string;
};

export type DecodeBase32Result = Result<
  Uint8Array,
  CryptoError<CryptoErrorCode.InvalidBase32 | CryptoErrorCode.Unexpected>
>;

export function decodeBase32(params: DecodeBase32Params & NonThrowing): DecodeBase32Result;
export function decodeBase32(params: DecodeBase32Params & Throwing): Uint8Array;
export function decodeBase32(params: DecodeBase32Params & (Throwing | NonThrowing)): Uint8Array | DecodeBase32Result;
export function decodeBase32(params: DecodeBase32Params & (Throwing | NonThrowing)) {
  const result = ((): DecodeBase32Result => {
    try {
      const inputLength = params.encoded.length;
      const remainingBits = (inputLength * 5) % 8;
      const paddingBits = remainingBits === 0 ? 0 : 8 - remainingBits;

      let bufferBits = 0;
      let buffer = 0;

      let outputIndex = 0;
      let decodedBytes = new Uint8Array(Math.ceil((inputLength * 5) / 8));

      for (let position = 0; position < inputLength; position++) {
        const alphabetIndex = alphabet.indexOf(params.encoded[position]);
        if (alphabetIndex === -1) {
          return Result.err(
            new CryptoError(CryptoErrorCode.InvalidBase32, `Found invalid character: ${params.encoded[position]}!`)
          );
        }

        buffer = (buffer << 5) | alphabetIndex;
        bufferBits += 5;

        if (bufferBits >= 8) {
          decodedBytes[outputIndex++] = (buffer >>> (bufferBits + paddingBits - 8)) & 255;
          bufferBits -= 8;
        }
      }

      if (bufferBits > 0) {
        decodedBytes[outputIndex] = (buffer << (bufferBits + paddingBits - 8)) & 255;
      }

      if (remainingBits !== 0) {
        decodedBytes = decodedBytes.slice(1);
      }

      return Result.ok(decodedBytes);
    } catch (e) {
      return Result.err(new CryptoError(CryptoErrorCode.Unexpected, "Unexpected error.", { cause: e }));
    }
  })();

  return Result.unwrap(result, params.throwOnError);
}
