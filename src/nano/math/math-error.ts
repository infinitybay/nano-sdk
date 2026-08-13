import { MathErrorCode } from "./math-error-code";

export class MathError<TCode extends MathErrorCode = MathErrorCode> extends Error {
  readonly code: TCode;

  constructor(code: TCode, message: string, options?: { cause?: unknown }) {
    super(message, options);

    this.name = "MathError";
    this.code = code;
  }
}
