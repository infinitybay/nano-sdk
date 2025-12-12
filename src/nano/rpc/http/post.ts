import z from "zod";

import { ErrorResponse } from "../responses/error-response";
import { defaultHttpClient } from "./http-client";
import { PostError } from "./post-error";
import { PostResult } from "./post-result";
import { RequestConfig, SafeRequestConfig, ThrowingRequestConfig } from "./request-config";

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
  config?: SafeRequestConfig
): Promise<PostResult<z.infer<U>>>;

export async function post<T extends z.ZodType, U extends z.ZodType>(
  url: string,
  requestBody: z.infer<T>,
  requestSchema: T,
  responseSchema: U,
  config?: RequestConfig
): Promise<PostResult<z.infer<U>> | z.infer<U>> {
  try {
    if (!requestSchema.safeParse(requestBody).success) {
      throw new PostError("Request parsing failed.");
    }

    const httpClient = config?.httpClient ?? defaultHttpClient;
    const httpResponse = await httpClient.post(url, requestBody, config);
    if (!httpResponse.success) {
      throw new PostError(httpResponse.error.message, {
        status: httpResponse.status,
        statusText: httpResponse.statusText,
      });
    }
    const errorResponse = ErrorResponse().safeParse(httpResponse.data);
    if (errorResponse.success) {
      throw new PostError(errorResponse.data.error, {
        status: httpResponse.status,
        statusText: httpResponse.statusText,
      });
    }
    const response = responseSchema.safeParse(httpResponse.data);
    if (!response.success) {
      throw new PostError(
        "Response parsing failed. Please contact the library developer with details about your usage and environment.",
        {
          status: httpResponse.status,
          statusText: httpResponse.statusText,
        }
      );
    }
    return config?.throwOnError
      ? response.data
      : {
          success: true,
          data: response.data,
          status: httpResponse.status,
          statusText: httpResponse.statusText,
        };
  } catch (e) {
    if (e instanceof PostError) {
      if (config?.throwOnError) {
        throw e;
      } else {
        return { success: false, error: { message: e.message }, status: e.status, statusText: e.statusText };
      }
    }
    if (e instanceof Error) {
      if (config?.throwOnError) {
        throw e;
      } else {
        return { success: false, error: { message: e.message } };
      }
    }

    if (config?.throwOnError) {
      throw new Error(
        "An unknown error occurred. Please contact the library developer with details about your usage and environment."
      );
    }

    return {
      success: false,
      error: {
        message:
          "An unknown error occurred. Please contact the library developer with details about your usage and environment.",
      },
    };
  }
}

export function postFunction<T extends z.ZodType, U extends z.ZodType>(requestSchema: T, responseSchema: U) {
  function fn(url: string, request: z.infer<T>, config: ThrowingRequestConfig): Promise<z.infer<U>>;
  function fn(url: string, request: z.infer<T>, config?: SafeRequestConfig): Promise<PostResult<z.infer<U>>>;
  async function fn(
    url: string,
    request: z.infer<T>,
    config?: RequestConfig
  ): Promise<PostResult<z.infer<U>> | z.infer<U>> {
    if (config?.throwOnError === true) {
      return post(url, request, requestSchema, responseSchema, config as ThrowingRequestConfig);
    } else {
      return post(url, request, requestSchema, responseSchema, config as SafeRequestConfig);
    }
  }
  return fn;
}
