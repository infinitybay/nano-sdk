import { BlockErrorCode } from "./block-error-code";

export class BlockError<TCode extends BlockErrorCode = BlockErrorCode> extends Error {
  readonly code: TCode;

  constructor(code: TCode, message: string, options?: { cause?: unknown }) {
    super(message, options);

    this.name = "BlockError";
    this.code = code;
  }
}
