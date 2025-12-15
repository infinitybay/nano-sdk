import { post } from "../http/post";
import { PostResult } from "../http/post-result";
import { NonThrowingRequestConfig, RequestConfig, ThrowingRequestConfig } from "../http/request-config";
import { TelemetryRequest } from "../requests/telemetry";
import { TelemetryResponse } from "../responses/telemetry";
import { BoolFlag } from "./conditional-types/bool-flag";
import { StringFlag } from "./conditional-types/string-flag";
import { StringOrNumberFlag } from "./conditional-types/string-or-number-flag";
import { WithDefault } from "./conditional-types/with-default";

type ResponseType<T extends TelemetryRequest> = TelemetryResponse<{
  ADDRESS: StringFlag<WithDefault<T, "address", undefined>["address"]>;
  PORT: StringOrNumberFlag<WithDefault<T, "port", undefined>["port"]>;
  RAW: BoolFlag<WithDefault<T, "raw", false>["raw"]>;
}>;

export function telemetry<const T extends TelemetryRequest>(
  url: string,
  request: T,
  config?: NonThrowingRequestConfig
): Promise<PostResult<ResponseType<T>>>;

export function telemetry<const T extends TelemetryRequest>(
  url: string,
  request: T,
  config: ThrowingRequestConfig
): Promise<ResponseType<T>>;

export function telemetry<const T extends TelemetryRequest>(
  url: string,
  request: T,
  config?: RequestConfig
): Promise<ResponseType<T>> | Promise<PostResult<ResponseType<T>>>;

export function telemetry(url: string, request: TelemetryRequest, config?: RequestConfig) {
  if (config?.throwOnError === false) {
    return post(
      url,
      request,
      TelemetryRequest(),
      TelemetryResponse({
        address: request.address !== undefined,
        port: request.port !== undefined,
        raw: request.raw === true,
      }),
      config as NonThrowingRequestConfig
    );
  } else {
    return post(
      url,
      request,
      TelemetryRequest(),
      TelemetryResponse({
        address: request.address !== undefined,
        port: request.port !== undefined,
        raw: request.raw === true,
      }),
      config as ThrowingRequestConfig
    );
  }
}
