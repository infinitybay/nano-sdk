import axios from "axios";

import { Nano } from "nano-sdk";

const nanoRpcUrl = "http://127.0.0.1:7076";

const axiosHttpClient: Nano.RPC.HttpClient = {
  async post(url, body, config): Promise<Nano.RPC.HttpResponse> {
    try {
      const response = await axios.post(url, body, {
        headers: { "Content-Type": "application/json" },
        signal: config?.abortSignal,
        timeout: config?.timeoutInMs,
      });
      return {
        success: true,
        data: response.data,
        status: response.status,
        statusText: response.statusText
      };
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return {
          success: false,
          error: { message: err.message },
          status: err.response?.status,
          statusText: err.response?.statusText,
        };
      }
      return { success: false, error: { message: "Unknown axios error" } };
    }
  },
};

async function fetchAccountBalance() {
  const response = await Nano.RPC.account_balance(
    nanoRpcUrl,
    {
      action: "account_balance",
      account: "nano_3t6k35gi95xu6tergt6p69ck76ogmitsa8mnijtpxm9fkcm736xtoncuohr3",
    },
    {
      httpClient: axiosHttpClient,
      timeoutInMs: 2000,
      throwOnError: false,
    }
  );

  if (response.success) {
    console.log("Balance:", response.data.balance);
  } else {
    console.error("RPC Error:", response.error.message);
  }
}

fetchAccountBalance();
