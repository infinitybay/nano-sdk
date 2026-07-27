export class PostError extends Error {
  readonly status?: number;
  readonly statusText?: string;

  constructor(message: string, meta?: { status?: number; statusText?: string; cause?: unknown }) {
    super(message, { cause: meta?.cause });

    this.name = "PostError";
    this.status = meta?.status;
    this.statusText = meta?.statusText;
  }
}
