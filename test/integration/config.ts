const DEFAULT_NANO_RPC_URL = "http://127.0.0.1:7076";

export const rpcUrl = process.env.NANO_RPC_URL ?? process.env.npm_package_config_nanoRpcUrl ?? DEFAULT_NANO_RPC_URL;

export const rpcRequestConfig = {
  timeoutInMs: 2000,
  throwOnError: false,
} as const;
