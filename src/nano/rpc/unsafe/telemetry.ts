import { TelemetryRequest } from "../requests/telemetry";
import { TelemetryResponse } from "../responses/telemetry";
import { BoolFlag, RequestConfig, StringFlag, StringOrNumberFlag, WithDefault } from "../safe/post";
import { telemetry as safeTelemetry } from "../safe/telemetry";
import { unwrapRpcResult } from "./utils";

export function telemetry<T extends TelemetryRequest>(
  url: string,
  request: T,
  config?: RequestConfig
): Promise<
  TelemetryResponse<{
    ADDRESS: StringFlag<WithDefault<T, "address", undefined>["address"]>;
    PORT: StringOrNumberFlag<WithDefault<T, "port", undefined>["port"]>;
    RAW: BoolFlag<WithDefault<T, "raw", false>["raw"]>;
  }>
>;
export function telemetry(url: string, request: TelemetryRequest, config?: RequestConfig) {
  return unwrapRpcResult(safeTelemetry(url, request, config));
}
