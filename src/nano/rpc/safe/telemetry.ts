import { TelemetryRequest } from "../requests/telemetry";
import { TelemetryResponse } from "../responses/telemetry";
import { BoolFlag, post, RequestConfig, Response, StringFlag, StringOrNumberFlag, WithDefault } from "./post";

export function telemetry<T extends TelemetryRequest>(
  url: string,
  request: T,
  config?: RequestConfig
): Promise<
  Response<
    TelemetryResponse<{
      ADDRESS: StringFlag<WithDefault<T, "address", undefined>["address"]>;
      PORT: StringOrNumberFlag<WithDefault<T, "port", undefined>["port"]>;
      RAW: BoolFlag<WithDefault<T, "raw", false>["raw"]>;
    }>
  >
>;
export function telemetry(url: string, request: TelemetryRequest, config?: RequestConfig) {
  return post(
    url,
    request,
    TelemetryRequest(),
    TelemetryResponse({
      address: request.address !== undefined,
      port: request.port !== undefined,
      raw: request.raw === true,
    }),
    config
  );
}
