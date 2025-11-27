import type z from "zod";

import { post as safePost, RequestConfig } from "../safe/post";
import { unwrapRpcResult } from "./utils";

export function post<T extends z.ZodType, U extends z.ZodType>(
  url: string,
  requestBody: z.infer<T>,
  requestSchema: T,
  responseSchema: U,
  config?: RequestConfig
) {
  return unwrapRpcResult(safePost(url, requestBody, requestSchema, responseSchema, config));
}

export function postFunction<T extends z.ZodType, U extends z.ZodType>(requestSchema: T, responseSchema: U) {
  return async (url: string, request: z.infer<T>, config?: RequestConfig): Promise<z.infer<U>> => {
    return post(url, request, requestSchema, responseSchema, config);
  };
}
