import { z } from "zod";

import { Result } from "../../types/result";
import { ErrorResponse } from "../responses/error-response";
import { defaultHttpClient } from "./http-client";
import { PostError } from "./post-error";
import { PostErrorCode } from "./post-error-code";
import { PostResult, SuccessfulPostResult } from "./post-result";
import { NonThrowingRequestConfig, RequestConfig, ThrowingRequestConfig } from "./request-config";

export async function post<T extends z.ZodType, U extends z.ZodType>(
  url: string,
  requestBody: z.infer<T>,
  requestSchema: T,
  responseSchema: U,
  config: ThrowingRequestConfig
): Promise<z.infer<U>>;

export async function post<T extends z.ZodType, U extends z.ZodType>(
  url: string,
  requestBody: z.infer<T>,
  requestSchema: T,
  responseSchema: U,
  config?: NonThrowingRequestConfig
): Promise<PostResult<z.infer<U>>>;

export async function post<T extends z.ZodType, U extends z.ZodType>(
  url: string,
  requestBody: z.infer<T>,
  requestSchema: T,
  responseSchema: U,
  config?: RequestConfig
): Promise<PostResult<z.infer<U>> | z.infer<U>> {
  const result = await (async (): Promise<Result<SuccessfulPostResult<z.infer<U>>, PostError>> => {
    try {
      if (!requestSchema.safeParse(requestBody).success) {
        return Result.err(new PostError(PostErrorCode.InvalidRequest, "Request parsing failed."));
      }

      const httpClient = config?.httpClient ?? defaultHttpClient;
      let httpResponse;
      try {
        httpResponse = await httpClient.post(url, requestBody, config);
      } catch (e) {
        if (e instanceof PostError) {
          return Result.err(e);
        }

        if (e instanceof Error) {
          return Result.err(new PostError(PostErrorCode.HttpClientError, e.message, { cause: e }));
        }

        throw e;
      }

      if (!httpResponse.success) {
        return Result.err(
          new PostError(httpResponse.error.code ?? PostErrorCode.TransportError, httpResponse.error.message, {
            status: httpResponse.status,
            statusText: httpResponse.statusText,
          })
        );
      }
      const errorResponse = ErrorResponse().safeParse(httpResponse.data);
      if (errorResponse.success) {
        return Result.err(
          new PostError(PostErrorCode.NodeError, errorResponse.data.error, {
            status: httpResponse.status,
            statusText: httpResponse.statusText,
          })
        );
      }
      const response = responseSchema.safeParse(httpResponse.data);
      if (!response.success) {
        return Result.err(
          new PostError(
            PostErrorCode.InvalidResponse,
            "Response parsing failed. Please contact the library developer with details about your usage and environment.",
            {
              status: httpResponse.status,
              statusText: httpResponse.statusText,
            }
          )
        );
      }

      return Result.ok({
        success: true,
        data: response.data,
        status: httpResponse.status,
        statusText: httpResponse.statusText,
      });
    } catch (e) {
      return Result.err(
        new PostError(
          PostErrorCode.Unexpected,
          "An unknown error occurred. Please contact the library developer with details about your usage and environment.",
          { cause: e }
        )
      );
    }
  })();

  if (config?.throwOnError === false) {
    if (result.success) {
      return result.data;
    }

    return {
      success: false,
      error: { code: result.error.code, message: result.error.message },
      status: result.error.status,
      statusText: result.error.statusText,
    };
  }

  return Result.unwrap(result, config?.throwOnError).data;
}

export function postFunction<T extends z.ZodType, U extends z.ZodType>(requestSchema: T, responseSchema: U) {
  function fn(url: string, request: z.infer<T>, config: ThrowingRequestConfig): Promise<z.infer<U>>;
  function fn(url: string, request: z.infer<T>, config?: NonThrowingRequestConfig): Promise<PostResult<z.infer<U>>>;
  async function fn(
    url: string,
    request: z.infer<T>,
    config?: RequestConfig
  ): Promise<PostResult<z.infer<U>> | z.infer<U>> {
    if (config?.throwOnError === false) {
      return post(url, request, requestSchema, responseSchema, config as NonThrowingRequestConfig);
    }

    return post(url, request, requestSchema, responseSchema, config as ThrowingRequestConfig);
  }
  return fn;
}
