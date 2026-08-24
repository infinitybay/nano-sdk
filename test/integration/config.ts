import { NonThrowingRequestConfig } from "../../src/nano/rpc/http/request-config";

const DEFAULT_NANO_RPC_URL = "http://127.0.0.1:7076";
const DEFAULT_NANO_WEB_SOCKET_URL = "ws://127.0.0.1:7078";

export const extendedLedgerEnabled =
  (process.env.NANO_EXTENDED_LEDGER ?? process.env.npm_package_config_nanoExtendedLedger)?.toLowerCase() === "true";
export const rpcUrl = process.env.NANO_RPC_URL ?? process.env.npm_package_config_nanoRpcUrl ?? DEFAULT_NANO_RPC_URL;
export const webSocketUrl =
  process.env.NANO_WEB_SOCKET_URL ?? process.env.npm_package_config_nanoWebSocketUrl ?? DEFAULT_NANO_WEB_SOCKET_URL;
export const webSocketOpenTimeout = 5_000;
export const webSocketMessageTimeout = 60_000;

export const rpcRequestConfig: NonThrowingRequestConfig = {
  timeoutInMs: 2000,
  throwOnError: false,
} as const;
