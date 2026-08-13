import { CryptoErrorCode } from "./crypto-error-code";

export class CryptoError<TCode extends CryptoErrorCode = CryptoErrorCode> extends Error {
  readonly code: TCode;

  constructor(code: TCode, message: string, options?: { cause?: unknown }) {
    super(message, options);

    this.name = "CryptoError";
    this.code = code;
  }
}
