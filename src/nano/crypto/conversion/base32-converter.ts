import { NonThrowing } from "../../types/non-throwing";
import { Result } from "../../types/result";
import { Throwing } from "../../types/throwing";

const alphabet = "13456789abcdefghijkmnopqrstuwxyz";

type EncodeBase32Params = {
  bytes: Uint8Array;
} & (Throwing | NonThrowing);

function encodeBase32Throwing(params: EncodeBase32Params & Throwing): string {
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

  return encoded;
}

function encodeBase32NonThrowing(params: EncodeBase32Params & NonThrowing): Result<string> {
  try {
    return {
      success: true,
      data: encodeBase32Throwing({ ...params, throwOnError: true }),
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e : new Error("Unexpected error."),
    };
  }
}

export function encodeBase32(params: EncodeBase32Params & NonThrowing): Result<string>;
export function encodeBase32(params: EncodeBase32Params & Throwing): string;
export function encodeBase32(params: EncodeBase32Params): string | Result<string>;
export function encodeBase32(params: EncodeBase32Params) {
  if (params.throwOnError === false) {
    return encodeBase32NonThrowing({ ...params, throwOnError: false });
  } else {
    return encodeBase32Throwing({ ...params, throwOnError: true });
  }
}

type DecodeBase32Params = {
  encoded: string;
} & (Throwing | NonThrowing);

function decodeBase32Throwing(params: DecodeBase32Params & Throwing): Uint8Array {
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
      throw new Error(`Found invalid character: ${params.encoded[position]}!`);
    }

    buffer = (buffer << 5) | alphabetIndex;
    bufferBits += 5;

    if (bufferBits >= 8) {
      decodedBytes[outputIndex++] = (buffer >>> (bufferBits + paddingBits - 8)) & 255;
      bufferBits -= 8;
    }
  }

  if (bufferBits > 0) {
    decodedBytes[outputIndex++] = (buffer << (bufferBits + paddingBits - 8)) & 255;
  }

  if (remainingBits !== 0) {
    decodedBytes = decodedBytes.slice(1);
  }

  return decodedBytes;
}

function decodeBase32NonThrowing(params: DecodeBase32Params & NonThrowing): Result<Uint8Array> {
  try {
    return {
      success: true,
      data: decodeBase32Throwing({ ...params, throwOnError: true }),
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e : new Error("Unexpected error."),
    };
  }
}

export function decodeBase32(params: DecodeBase32Params & NonThrowing): Result<Uint8Array>;
export function decodeBase32(params: DecodeBase32Params & Throwing): Uint8Array;
export function decodeBase32(params: DecodeBase32Params): Uint8Array | Result<Uint8Array>;
export function decodeBase32(params: DecodeBase32Params) {
  if (params.throwOnError === false) {
    return decodeBase32NonThrowing({ ...params, throwOnError: false });
  } else {
    return decodeBase32Throwing({ ...params, throwOnError: true });
  }
}
