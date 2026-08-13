import { PostErrorCode } from "./post-error-code";

export type SuccessfulPostResult<TDataType> = {
  success: true;
  data: TDataType;
  status?: number;
  statusText?: string;
};

export type UnsuccessfulPostResult<
  TCode extends PostErrorCode =
    | PostErrorCode.HttpClientError
    | PostErrorCode.HttpError
    | PostErrorCode.InvalidRequest
    | PostErrorCode.InvalidResponse
    | PostErrorCode.NodeError
    | PostErrorCode.TransportError
    | PostErrorCode.Unexpected,
> = {
  success: false;
  error: {
    code: TCode;
    message: string;
  };
  status?: number;
  statusText?: string;
};

export type PostResult<
  TDataType,
  TCode extends PostErrorCode =
    | PostErrorCode.HttpClientError
    | PostErrorCode.HttpError
    | PostErrorCode.InvalidRequest
    | PostErrorCode.InvalidResponse
    | PostErrorCode.NodeError
    | PostErrorCode.TransportError
    | PostErrorCode.Unexpected,
> = SuccessfulPostResult<TDataType> | UnsuccessfulPostResult<TCode>;
