import { Result } from "../../types/result";

const alphabet = "13456789abcdefghijkmnopqrstuwxyz";

export function encodeBase32(bytes: Uint8Array): string {
  const inputLength = bytes.length;
  const totalBits = inputLength * 8;
  const remainingBits = totalBits % 5;
  const paddingBits = remainingBits === 0 ? 0 : 5 - remainingBits;

  let buffer = 0;
  let encoded = "";
  let bufferBits = 0;

  for (let index = 0; index < inputLength; index++) {
    buffer = (buffer << 8) | bytes[index];
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

export function safeEncodeBase32(bytes: Uint8Array): Result<string> {
  try {
    return { success: true, data: encodeBase32(bytes) };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err : new Error("Unexpected error.") };
  }
}

export function decodeBase32(encoded: string): Uint8Array {
  const inputLength = encoded.length;
  const remainingBits = (inputLength * 5) % 8;
  const paddingBits = remainingBits === 0 ? 0 : 8 - remainingBits;

  let bufferBits = 0;
  let buffer = 0;

  let outputIndex = 0;
  let decodedBytes = new Uint8Array(Math.ceil((inputLength * 5) / 8));

  for (let position = 0; position < inputLength; position++) {
    const alphabetIndex = alphabet.indexOf(encoded[position]);
    if (alphabetIndex === -1) {
      throw new Error(`Found invalid character: ${encoded[position]}!`);
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

export function safeDecodeBase32(encoded: string): Result<Uint8Array> {
  try {
    return { success: true, data: decodeBase32(encoded) };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err : new Error("Unexpected error.") };
  }
}
