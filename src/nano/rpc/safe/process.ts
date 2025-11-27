import { ProcessRequest } from "../requests/process";
import { ProcessResponse } from "../responses/process";
import { BoolFlag, post, RequestConfig, Response, WithDefault } from "./post";

export function process<const T extends ProcessRequest>(
  url: string,
  request: T,
  config?: RequestConfig
): Promise<
  Response<
    ProcessResponse<{
      ASYNC: BoolFlag<WithDefault<T, "async", false>["async"]>;
    }>
  >
>;
export function process(url: string, request: ProcessRequest, config?: RequestConfig) {
  return post(
    url,
    request,
    ProcessRequest(),
    ProcessResponse({
      async: request.async === true,
    }),
    config
  );
}
