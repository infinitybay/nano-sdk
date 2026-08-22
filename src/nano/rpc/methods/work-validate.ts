import { post } from "../http/post";
import { PostResult } from "../http/post-result";
import { NonThrowingRequestConfig, RequestConfig, ThrowingRequestConfig } from "../http/request-config";
import { WorkValidateRequest } from "../requests/work-validate";
import { WorkValidateResponse } from "../responses/work-validate";
import { NotUndefinedFlag } from "./conditional-types/not-undefined-flag";
import { WithDefault } from "./conditional-types/with-default";

type ResponseType<T extends WorkValidateRequest> = WorkValidateResponse<{
  DIFFICULTY: NotUndefinedFlag<WithDefault<T, "difficulty", undefined>["difficulty"]>;
}>;

export function work_validate<const T extends WorkValidateRequest>(
  url: string,
  request: T,
  config?: NonThrowingRequestConfig
): Promise<PostResult<ResponseType<T>>>;

export function work_validate<const T extends WorkValidateRequest>(
  url: string,
  request: T,
  config: ThrowingRequestConfig
): Promise<ResponseType<T>>;

export function work_validate<const T extends WorkValidateRequest>(
  url: string,
  request: T,
  config?: RequestConfig
): Promise<ResponseType<T>> | Promise<PostResult<ResponseType<T>>>;

export function work_validate(url: string, request: WorkValidateRequest, config?: RequestConfig) {
  if (config?.throwOnError === false) {
    return post(
      url,
      request,
      WorkValidateRequest(),
      WorkValidateResponse({ difficulty: request.difficulty !== undefined }),
      config as NonThrowingRequestConfig
    );
  } else {
    return post(
      url,
      request,
      WorkValidateRequest(),
      WorkValidateResponse({ difficulty: request.difficulty !== undefined }),
      config as ThrowingRequestConfig
    );
  }
}
