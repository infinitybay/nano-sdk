import { PostErrorCode } from "./post-error-code";

export class PostError<TCode extends PostErrorCode = PostErrorCode> extends Error {
  readonly code: TCode;
  readonly status?: number;
  readonly statusText?: string;

  constructor(code: TCode, message: string, options?: { cause?: unknown; status?: number; statusText?: string }) {
    super(message, { cause: options?.cause });

    this.name = "PostError";
    this.code = code;
    this.status = options?.status;
    this.statusText = options?.statusText;
  }
}
